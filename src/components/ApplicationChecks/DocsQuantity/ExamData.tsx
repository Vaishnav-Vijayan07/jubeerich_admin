import React from "react";
import NoDoc from "../NoDoc";
import CardData from "./CardData";

type Props = {
  Exams: Exam[];
};

type Exam = {
  id: number;
  exam_type: string;
  score_card: string;
  overall_score: string;
};

function ExamData({ Exams }: Props) {
  if (!Exams?.length) return <NoDoc />;

  return (
    <div className="row">
      {Exams.map((doc: Exam) => (
        <div className="col-3">
          <CardData type={`${doc.exam_type} - Score-${doc.overall_score}`} folder="examDocuments" filename={doc.score_card} />
        </div>
      ))}
    </div>
  );
}

export default ExamData;
