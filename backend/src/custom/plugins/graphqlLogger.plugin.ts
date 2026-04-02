import { ApolloServerPlugin, GraphQLRequestListener } from '@apollo/server';
import chalk from 'chalk';
import { Logger } from '@nestjs/common';

const logger = new Logger(" GraphQL ");

export function graphqlLoggerPlugin(): ApolloServerPlugin<any> {
  return {
    async requestDidStart(): Promise<GraphQLRequestListener<any>> {
      const start = Date.now();

      return {
        async didResolveOperation({ request, document, operationName, contextValue }) {
          if (!document) return;

          const opDef = document.definitions.find(d => d.kind === 'OperationDefinition');
          const opType = opDef?.kind === 'OperationDefinition' ? opDef.operation.toUpperCase() : 'UNKNOWN';
          if (opType === 'UNKNOWN') return;

          // Better introspection detection
          const isIntrospection =
            operationName === 'IntrospectionQuery' ||
            document.definitions.some(d => (d as any).name?.value === '__schema');
          if (isIntrospection) return;

          const userId = contextValue?.req?.user?.sub || '-';
          const client = contextValue?.req?.headers['user-agent'] || '-';
          const url = contextValue?.req?.url || '-';

          (contextValue as any)._graphqlLogger = {
            opType,
            operationName,
            userId,
            client,
            url,
            start,
            cacheHits: 0,
            dbQueries: 0,
          };
        },

async willSendResponse(requestContext) {
  const { contextValue, response } = requestContext;
  const info = (contextValue as any)._graphqlLogger;
  if (!info) return;

  const { opType, operationName, userId, client, url, start, cacheHits, dbQueries } = info;
  const duration = Date.now() - start;

  // Extract errors across Apollo Server 4 body shapes
  let errors: readonly any[] = [];
  const body = response.body as any;

  if (body?.kind === 'single') {
    errors = body.singleResult?.errors ?? [];
  } else if (body?.kind === 'incremental') {
    errors = [
      ...(body.initialResult?.errors ?? []),
      ...((body.subsequentResults ?? []).flatMap((r: any) => r.errors ?? [])),
    ];
  }

  let hasErrors = errors.length > 0;
  let status = 200;
  let errorMessage = '';

  if (hasErrors) {
    const err = errors[0];
    const ext = err?.extensions ?? {};
    status =
      ext.status ??
      ext.originalError?.statusCode ??
      ext.response?.statusCode ??
      500;

    errorMessage =
      ext.originalError?.message ??
      err.message ??
      'Unknown Error';

    // Set HTTP status for Apollo + Express
    requestContext.response.http = {
      ...(requestContext.response.http ?? { headers: new (require('@apollo/server').HeaderMap)() }),
      status,
    };
    if (contextValue?.res) {
      try {
        contextValue.res.statusCode = status;
      } catch {}
    }
  }

  const statusLabel = hasErrors ? chalk.red('ERROR') : chalk.green('SUCCESS');
  const statusEmoji = hasErrors ? '⚠️' : '✨';
  const dataSource = cacheHits > 0 ? (dbQueries > 0 ? 'MIXED' : 'CACHE') : 'DB';
  const dataSourceEmoji = cacheHits > 0 ? (dbQueries > 0 ? '🔄' : '🎯') : '🗄️';

  const fullMessage = [
    `${statusEmoji} ${chalk.bold(`[${new Date().toISOString()}]`)} ${chalk.blue(opType)} ${chalk.green(operationName || '-')} ${statusLabel}`,
    `   👤 User: ${chalk.cyan(userId)} | 🛰️ Client: ${chalk.yellow(client)}`,
    `   🌐 URL: ${chalk.cyan(url)} | 🕒 Duration: ${chalk.magenta(duration + 'ms')}`,
    `   ${dataSourceEmoji} Source: ${chalk.blue(dataSource)} | ♻️ CacheHits: ${chalk.yellow(cacheHits.toString())} | 🧮 DBQueries: ${chalk.yellow(dbQueries.toString())}`,
    hasErrors ? `   🚫 HTTP ${chalk.red(status.toString())} | 💥 ${chalk.red(errorMessage)}` : ''
  ].filter(Boolean).join('\n');

  if (hasErrors) {
    logger.error(fullMessage);
  } else {
    logger.log(fullMessage);
  }
}

      };
    },
  };
}
