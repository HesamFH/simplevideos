const yup = require("yup");

//! Video validation schema

exports.videoValidationSchema = yup.object().shape({
  title: yup
    .string()
    .min("6", "عنوان ویدیو باید حداقل شامل 6 حرف باشد")
    .max("100", "عنوان ویدیو می تواند حداکثر 100 حرف باشد")
    .required("عنوان ویدیو اجباری می باشد"),
  description: yup.string(),
  video: yup.object().shape({
    mimetype: yup.string().oneOf(["video/mp4"], "فرمت ویدیو فقط باید mp4 باشد"),
    name: yup.string().required("ویدیو اجباری می باشد"),
  }),
  thumbnail: yup.object().shape({
    mimetype: yup
      .string()
      .oneOf(
        ["image/png", "image/jpeg"],
        "فرمت عکس بند انگشتی فقط باید png یا jpeg باشد"
      ),
    name: yup.string().required("عکس بندانگشتی اجباری می باشد"),
  }),
});
