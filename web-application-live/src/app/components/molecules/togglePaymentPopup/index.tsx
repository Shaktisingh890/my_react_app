import PopUp from 'app/components/atoms/popup'
import React, { useState } from 'react'
import BankTransfer from '../bankTransfer'
import ChoosePayment from '../choosePayment'

export default function PaymentPopups({
    bankTransfer,
    isPayPopUp,
    onClose,
    amountToPay,
    open,
    Id,
    paymentStatus,
    invoiceAmount,
    paymentLink,
    status,

    ...rest

}) {

    const [isBankTransfer, setIsBankTransfer] = useState<boolean>(bankTransfer);

    return (
        <div>
            <PopUp
                modal
                position="bottom right"
                open={open}
                onClose={onClose}
                closeOnDocumentClick={false}
            >
                {isBankTransfer ?
                    <BankTransfer
                        onClose={onClose}
                        onBack={() => { setIsBankTransfer(false) }}
                        {...{ amountToPay, Id, paymentStatus, paymentLink }}
                    /> :
                    <ChoosePayment
                        onClose={onClose}
                        {...{ invoiceAmount, Id, paymentLink, status }}

                    />
                }
            </PopUp>
        </div>
    )
}
