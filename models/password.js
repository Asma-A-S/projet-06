const passwordValidator = require('password-validator')
var passwordSchema = new passwordValidator();

// Add properties to it
passwordSchema
.is().min(8)                                    
.is().max(100)                               
.has().uppercase()                              
.has().lowercase()                             
.has().digits(2)                                
.has().not().spaces()                        
.is().not().oneOf(['Password', 'Password123']); 

module.exports = passwordSchema;