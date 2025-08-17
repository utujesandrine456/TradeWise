const pool = require('../config/db');


const createBusinessProfile = async (req, res) => {
    try {
        const {
            user_id,
            business_name,
            business_type,
            industry,
            description,
            address,
            phone,
            website,
            tax_id,
            business_license,
            annual_revenue,
            employee_count,
            founded_year,
            business_hours,
            payment_methods,
            target_market,
            competitors,
            business_goals
        } = req.body;

       
        const { rows: existingProfile } = await pool.query(
            'SELECT id FROM business_profiles WHERE user_id = $1',
            [user_id]
        );

        if (existingProfile.length > 0) {
           
            const { rows: updatedProfile } = await pool.query(
                `UPDATE business_profiles 
                 SET business_name = $2, business_type = $3, industry = $4, description = $5,
                     address = $6, phone = $7, website = $8, tax_id = $9, business_license = $10,
                     annual_revenue = $11, employee_count = $12, founded_year = $13, business_hours = $14,
                     payment_methods = $15, target_market = $16, competitors = $17, business_goals = $18,
                     updated_at = NOW()
                 WHERE user_id = $1 
                 RETURNING *`,
                [user_id, business_name, business_type, industry, description, address, phone, website,
                 tax_id, business_license, annual_revenue, employee_count, founded_year, business_hours,
                 payment_methods, target_market, competitors, business_goals]
            );

            res.status(200).json({
                success: true,
                message: 'Business profile updated successfully',
                data: updatedProfile[0]
            });
        } else {
            
            const { rows: newProfile } = await pool.query(
                `INSERT INTO business_profiles (
                    user_id, business_name, business_type, industry, description, address, phone,
                    website, tax_id, business_license, annual_revenue, employee_count, founded_year,
                    business_hours, payment_methods, target_market, competitors, business_goals
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
                RETURNING *`,
                [user_id, business_name, business_type, industry, description, address, phone, website,
                 tax_id, business_license, annual_revenue, employee_count, founded_year, business_hours,
                 payment_methods, target_market, competitors, business_goals]
            );

            res.status(201).json({
                success: true,
                message: 'Business profile created successfully',
                data: newProfile[0]
            });
        }

    } catch (error) {
        console.error('Business profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating/updating business profile',
            error: error.message
        });
    }
};


const getBusinessProfile = async (req, res) => {
    try {
        const { user_id } = req.params;

        const { rows: profile } = await pool.query(
            'SELECT * FROM business_profiles WHERE user_id = $1',
            [user_id]
        );

        if (profile.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Business profile not found'
            });
        }

        res.status(200).json({
            success: true,
            data: profile[0]
        });

    } catch (error) {
        console.error('Get business profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching business profile',
            error: error.message
        });
    }
};


const getAllBusinessProfiles = async (req, res) => {
    try {
        const { rows: profiles } = await pool.query(
            `SELECT bp.*, u.company_name, u.business_email, u.role 
             FROM business_profiles bp 
             JOIN users u ON bp.user_id = u.id 
             ORDER BY bp.created_at DESC`
        );

        res.status(200).json({
            success: true,
            data: profiles
        });

    } catch (error) {
        console.error('Get all business profiles error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching business profiles',
            error: error.message
        });
    }
};


const deleteBusinessProfile = async (req, res) => {
    try {
        const { id } = req.params;

        const { rows: deletedProfile } = await pool.query(
            'DELETE FROM business_profiles WHERE id = $1 RETURNING *',
            [id]
        );

        if (deletedProfile.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Business profile not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Business profile deleted successfully',
            data: deletedProfile[0]
        });

    } catch (error) {
        console.error('Delete business profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting business profile',
            error: error.message
        });
    }
};

module.exports = {
    createBusinessProfile,
    getBusinessProfile,
    getAllBusinessProfiles,
    deleteBusinessProfile
};
