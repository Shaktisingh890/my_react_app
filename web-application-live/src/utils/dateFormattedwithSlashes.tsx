
export default function DateFormatedWithSalshes(date: string) {
    const dateObj = new Date(date);
    const selectedMonth = dateObj.getUTCMonth() + 1
    const month = selectedMonth < 10 ? "0" + selectedMonth : selectedMonth; //months from 1-12
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    var hour = dateObj.getHours() == 0 ? 12 : (dateObj.getHours() > 12 ? dateObj.getHours() - 12 : dateObj.getHours());
    var min = dateObj.getMinutes() < 10 ? '0' + dateObj.getMinutes() : dateObj.getMinutes();
    var ampm = dateObj.getHours() < 12 ? 'AM' : 'PM';
    var time = hour + ':' + min + ' ' + ampm;

    const newdate = time + " " + day + "/" + month + "/" + year;
    return newdate
}