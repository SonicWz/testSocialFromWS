import React, {useEffect} from 'react';

// export const useMarkFormFieldWithErrors = (errors: any) => {
//     useEffect(() => {
//         Object.keys(errors).forEach((item, index) => {
//             // @ts-ignore
//             errors[item].ref.classList.add('withError');
//             // @ts-ignore
//
//         });
//     }, [errors])
// }
export const useMarkFormFieldWithErrors = (errors: any, className: string) => {
    // add css-class className with each HTML element in the array of form errors, if they exist  (required, maxLength etc)
    // and returned function unmarkFormFieldWithErrors,than deletes css-class className with current element. Install on event "OnInput" of input
    useEffect(() => {
        Object.keys(errors).forEach((item, index) => {
            // @ts-ignore
            errors[item].ref.classList.add('withError');
        });
    }, [errors]);
    return (e: React.SyntheticEvent) => {
        unmarkFormFieldWithErrors(e, className)
    }
}

export const unmarkFormFieldWithErrors = (e: React.SyntheticEvent, className: string) => {
    e.currentTarget.classList.remove(className);
}