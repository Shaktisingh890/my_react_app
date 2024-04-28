

export default function DateFormated(date: string) {

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dateObj = new Date(date);
    const month = dateObj.getUTCMonth(); //months from 1-12
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();

    const newdate = day + ",\n" + months[month] + " " + year;
    return newdate
}
