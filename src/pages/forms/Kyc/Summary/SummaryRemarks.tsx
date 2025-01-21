import React from 'react'

type ISummaryRemark = {
    remarks: any,

}

const SummaryRemarks = ( { remarks } : ISummaryRemark) => {
    const styles = {
        h5: { fontWeight: "600px", fontSize: "16px" },
        p: { fontWeight: "500px", fontSize: "14px" },
    };

    return (
        <>
            <div>
                <h5 style={styles.h5}>Remarks</h5>
                <p style={styles.p}>
                    {remarks}
                </p>
            </div>
        </>
    )
}

export default SummaryRemarks