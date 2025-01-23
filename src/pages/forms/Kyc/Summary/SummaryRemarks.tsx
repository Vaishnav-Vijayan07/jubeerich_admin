import React from 'react'

type ISummaryRemark = {
    remarks: any,
    height: any

}

const SummaryRemarks = ( { remarks, height } : ISummaryRemark) => {
    const styles = {
        h5: { fontWeight: "600px", fontSize: "16px" },
        p: { fontWeight: "500px", fontSize: "14px" },
    };

    const remarkStyle: React.CSSProperties = {
        ...styles.p,
        maxHeight: `${height - 60}px`,
        overflowY: "auto",
        fontWeight: 400,
        scrollbarColor: "transparent transparent",
    }

    return (
        <>
            <div>
                <h5 style={styles.h5}>Remarks</h5>
                <p style={{ ...remarkStyle }} className='fs-14'>
                    {remarks}
                </p>
            </div>
        </>
    )
}

export default SummaryRemarks