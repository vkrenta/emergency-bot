const {Stage} = require('telegraf');
const path = require('path');
const {log} = require('../../helpers');

const stage = new Stage();
module.exports = () => {
    try {
        require('fs').readdirSync(path.join(__dirname)).forEach(function (file) {
            if (file.match(/^flow.*\.js$/)) {
                const name = file.replace('.js', '');
                require(`./${name}`)(stage);
            }
        });

        return stage;
    } catch (err) {
        log.error(`[error][stage:reports][event:get stage] err:${err.toString()}`, JSON.stringify(err));
        console.log(err)
    }
    return null;
}