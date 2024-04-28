

function calc(invoiceAmount) {
	const commissionPercent = 5;

    const commissionAmount = parseInt(Math.round(((invoiceAmount * commissionPercent) / 100) * 100)) / 100;

    const totalAmount = parseInt(Math.round((invoiceAmount + commissionAmount) * 100)) / 100;

    const unitAmount = Math.round(totalAmount * 100);

    return {totalAmount, unitAmount, commissionAmount};
}

// console.log(calc(67));





