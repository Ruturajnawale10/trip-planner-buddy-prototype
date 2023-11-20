import moment from "moment";

export class DateFormat {
  static format1(date) {
    return moment(date).format("DD MMMM YYYY");
  }

  static format2(date) {
    return moment(date).format("YYYY-MM-DD");
  }

  // Add more format methods as needed
}

// Example usage:
const currentDate = new Date();
// console.log(DateFormat.format1(currentDate)); // Outputs: "19 October 2023"
// console.log(DateFormat.format2(currentDate)); // Outputs: "2023-10-19"
