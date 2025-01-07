import moment from "moment";

//convert example -> 2023-08-29T03:54:39.206Z to  11:54
export const ISOTimeToUTC = (value) => {
  const currentDate = new Date();

  if (value) {
    const [hours, minutes] = value.split(":");
    currentDate.setHours(hours);
    currentDate.setMinutes(minutes);
    const formattedTime = currentDate.toISOString();
    return formattedTime;
  } else return "";
};

//convert example -> 11:30
export const ISOUTCtoTime = (value) => {
  return value ? moment(value)?.format("HH:mm") : "";
};
