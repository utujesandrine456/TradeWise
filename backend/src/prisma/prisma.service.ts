import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "../../generated/prisma";
import { performance } from "perf_hooks";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

  private readonly logger = new Logger(PrismaService.name);
  private interval!: NodeJS.Timeout;

  constructor() {
    super({
      log: ['error', 'warn'],
      // Add timeout configuration
      transactionOptions: {
        timeout: 10000, // 10 seconds for transactions
      },
    });
  }

  async onModuleInit() {
    const start = performance.now();

    try {
      // Add timeout to connection attempt
      await Promise.race([
        this.$connect(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database connection timeout')), 15000)
        )
      ]);

      const ms = Math.round(performance.now() - start);
      this.logger.log(`Prisma connected to database +${ms}ms`);
    } catch (error) {
      this.logger.error('Failed to connect to database:', error.message);
      throw error;
    }

    this.interval = setInterval(async () => {
      try {
        // Add timeout to health check
        await Promise.race([
          this.$queryRaw`SELECT 1`,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Health check timeout')), 5000)
          )
        ]);
        this.logger.log(`Keep-alive ping successful +0ms`);
      } catch (err: any) {
        this.logger.error(`Keep-alive ping FAILED`, err);

        if (err.code === "P1017" || err.message?.includes("closed")) {
          this.logger.warn("Detected closed connection. Attempting to reconnect...");

          const reconnectStart = performance.now();

          try {
            await this.$connect();

            const reconnectMs = Math.round(performance.now() - reconnectStart);
            this.logger.log(`Reconnected successfully +${reconnectMs}ms`);

            await this.$queryRaw`SELECT 1`;
            this.logger.log(`Post-reconnect ping successful +0ms`);
          } catch (reconnectErr) {
            this.logger.error("Reconnection attempt FAILED", reconnectErr);
          }
        }
      }
    }, 1 * 60_000);
  }

  async onModuleDestroy() {
    clearInterval(this.interval);
    await this.$disconnect();
    this.logger.log("Prisma disconnected");
  }
}
