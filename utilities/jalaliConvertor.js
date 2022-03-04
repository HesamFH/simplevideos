const moment = require("jalali-moment");

//! Converting the miladi date into jalali date
exports.convertDate = (date) => {
  return moment(date).locale("fa").format("YYYY/MM/DD");
};
