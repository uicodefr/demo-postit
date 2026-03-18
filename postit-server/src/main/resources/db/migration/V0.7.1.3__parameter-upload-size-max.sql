-- Create new parameter 'upload.size.max'

/* ROLLBACK SCRIPT :
 * 
 * DELETE FROM global_parameter WHERE param_name = 'upload.size.max';
 * 
 */

INSERT INTO global_parameter (param_name, param_value, client_view) VALUES
    ('upload.size.max', '10485700', true);
