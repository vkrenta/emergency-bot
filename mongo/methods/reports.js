const { responderModel } = require('../model');
module.exports.sendReport = (chatId,patientName,patientAge,patientGender,patientWeight,patientDiagnosis,patientHelp,patientHelpComment, patientResult,callcardId)=>{
    responderModel.findOneAndUpdate({chatId:chatId}, {$push: {'reports': {"fullName":patientName, "age": patientAge,
                "sex": patientGender,
                "weight":patientWeight,
                "diagnosis":patientDiagnosis,
                "helpProvided":patientHelp,
                "helpComment":patientHelpComment,
                "erResult":patientResult,
                "callcardId":callcardId

            }}}, {new: true}, (err, result) => {
    }  )
};
