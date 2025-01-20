
export let AvailabilityCheck = {
    country: 'United Kingdom',
    university: 'University of London',
    intake: '01/2025',
    course_link: 'https://www.example.com',
    stream: 'Computer Science',
    program: 'Bachelor of Science in Computer Science',
}

export let campusCheck = {
    university: 'University of London',
}

export let educationCheck = [
    {
        qualification: 'SSLC',
        school_name: 'ABC School',
        start_date: '01/2025',
        end_date: '01/2025',
        percentage: '80%',
        board_name: 'CBSE',
    },
    {
        qualification: 'Plus Two',
        school_name: 'ABC School',
        start_date: '01/2025',
        end_date: '01/2025',
        percentage: '80%',
        board_name: 'CBSE',
    },
]

export let graduationCheck = [
    {
        qualification: 'Bachelor of Science in Computer Science',
        school_name: 'ABC School',
        start_date: '01/2025',
        end_date: '01/2025',
        percentage: '80%',
        board_name: 'CBSE',
    },
    {
        qualification: 'Bachelor of Science in Computer Science',
        school_name: 'ABC School',
        start_date: '01/2025',
        end_date: '01/2025',
        percentage: '80%',
        board_name: 'CBSE',
    },
]

export let gapCheck = [
    {
        from: '01/2025',
        reason: 'Reason 1',
        to: '01/2025',
    },
    {
        from: '01/2025',
        reason: 'Reason 2',
        to: '01/2025',
    },
]

export let qualityCheck = {
    formatting: true,
    clarity: true,
    scanning: false,
}

export let applicationFeeCheck = {
    fee: 2500,
}

export let visaApproved = [
    {
        id: '1',
        visa_type: 'Tourist',
        approved_letter: 'Letter123',
        approved_country: {
            id: '101',
            country_name: 'Canada',
        },
    },
    {
        id: '2',
        visa_type: 'Business',
        approved_letter: 'Letter456',
        approved_country: {
            id: '102',
            country_name: 'United States',
        },
    },
]

export let visaDeclined = []

export let additionalDocs = {
    id: 1,
    passport_doc: 'passport123.pdf',
    updated_cv: 'cv_updated.pdf',
    profile_assessment_doc: 'assessment.pdf',
    lor: 'lor.pdf',
    sop: 'sop.pdf',
    gte_form: 'gte_form.pdf',
}

export let fundPlan = [
    {
        id: '1',
        type: 'Personal Savings',
        supporting_document: 'fund_plan.pdf',
    },
    {
        id: '2',
        type: 'Private Savings',
        supporting_document: 'fund_plan.pdf',
    }
]

export let educationDocs = [
    {
        id: 1,
        qualification: '10th',
        percentage: '80%',
        board_name: 'CBSE',
        school_name: 'Delhi Public School',
        mark_sheet: 'marksheet1.pdf',
        admit_card: 'admitcard1.pdf',
        certificate: 'certificate1.pdf',
    },
    {
        id: 2,
        qualification: '12th',
        percentage: '90%',
        board_name: 'ICSE',
        school_name: 'Convent of Jesus and Mary',
        mark_sheet: 'marksheet2.pdf',
        admit_card: 'admitcard2.pdf',
        certificate: 'certificate2.pdf',
    },
]

export let examDocs = [
    {
        id: 1,
        exam_type: 'SAT',
        score_card: 'sat_score.pdf',
        overall_score: '1200',
    },
    {
        id: 2,
        exam_type: 'IELTS',
        score_card: 'ielts_score.pdf',
        overall_score: '7',
    },
]

export let graduationDocs = [
    {
        id: 1,
        qualification: 'Bachelors',
        percentage: '70%',
        university_name: 'Delhi University',
        college_name: 'Sri Venkateswara College',
        mark_sheet: 'marksheets1.pdf',
        admit_card: 'admitcard1.pdf',
        certificate: 'certificate1.pdf',
        backlog_certificate: 'backlog1.pdf',
        registration_certificate: 'registration1.pdf',
        grading_scale_info: 'grading_scale_info1.pdf',
        transcript: 'transcript1.pdf',
        individual_marksheet: 'individual_marksheet1.pdf',
    },
    {
        id: 2,
        qualification: 'Masters',
        percentage: '80%',
        university_name: 'Jawaharlal Nehru University',
        college_name: 'School of International Studies',
        mark_sheet: 'marksheets2.pdf',
        admit_card: 'admitcard2.pdf',
        certificate: 'certificate2.pdf',
        backlog_certificate: 'backlog2.pdf',
        registration_certificate: 'registration2.pdf',
        grading_scale_info: 'grading_scale_info2.pdf',
        transcript: 'transcript2.pdf',
        individual_marksheet: 'individual_marksheet2.pdf',
    },
]

export let workInfoDocs = [
    {
        id: 1,
        designation: 'Software Engineer',
        company: 'Tech Corp',
        bank_statement: 'bank_statement1.pdf',
        job_offer_document: 'job_offer1.pdf',
        experience_certificate: 'experience_certificate1.pdf',
        appointment_document: 'appointment_document1.pdf',
        payslip_document: 'payslip1.pdf',
    },
    {
        id: 2,
        designation: 'Product Manager',
        company: 'Innovate Ltd',
        bank_statement: 'bank_statement2.pdf',
        job_offer_document: 'job_offer2.pdf',
        experience_certificate: 'experience_certificate2.pdf',
        appointment_document: 'appointment_document2.pdf',
        payslip_document: 'payslip2.pdf',
    },
]

export let policeDocs = [
    {
        id: 1,
        certificate: 'police123.pdf',
        country_name: 'India',
    },
    {
        id: 2,
        certificate: 'police456.pdf',
        country_name: 'United States',
    },
]

export let empHistories = {
        id: 1,
        visa_page: 'visa_page1.pdf',
        permit_card: 'permit_card1.pdf',
        salary_account_statement: 'salary_account_statement1.pdf',
        supporting_documents: 'supporting_documents1.pdf',
    }
