import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { fetchAnswersStats, fetchRatingStats } from "./FeedbackAnswersThunks";
import GenericStatsChart from "../graph/GenericStatsChart";
import { RatingStats } from "./FeedbackAnswersSlice";

const FeedbackList = () => {

    const [questionData, setQuestionData] = useState<RatingStats[]>([]);
    const [questionClicked, setQuestionClicked] = useState<boolean>(false);

    const dispatch = useAppDispatch();
    const { questionStats } = useAppSelector((state) => state.feedbackAnswers);

    const handleRowClick = (row: RatingStats) => {
        try {
            const questionText = row.question_text;

            dispatch(fetchRatingStats(questionText))
                .unwrap()
                .then((data) => {
                    setQuestionData(data)
                    setQuestionClicked(true);
                })
                .catch((err) => {
                    throw new Error(err);
                });

        } catch (err) {
            console.error("Error fetching rating stats:", err);
        };
    }


    const back = () => {
        setQuestionClicked(false);
    }


    useEffect(() => {
        dispatch(fetchAnswersStats());
    }, [dispatch]);


    return (
        <>{
            !questionClicked ?
                <GenericStatsChart
                    data={questionStats}
                    xKey="question_text"
                    barKeys={["count"]}
                    pieKeys={["count"]}
                    xLabel="Feedback Answers"
                    tableColumns={[
                        { id: "question_text", label: "Question" },
                        { id: "count", label: "Count Of Ratings" },
                    ]}
                    tableRows={questionStats}
                    title="Feedback Answers Statistics"
                    onTableRowClick={handleRowClick}
                    chartRowsCount={questionStats.length}
                />
                :
                <>
                    <button onClick={() => back()}>back</button>

                    <GenericStatsChart
                        data={questionData}
                        xKey="rating"
                        barKeys={["count"]}
                        pieKeys={["count"]}
                        xLabel={`${questionData.length ? questionData[0].question_text : ''}`}
                        tableColumns={[
                            { id: "rating", label: "Rating" },
                            { id: "count", label: "Count" },
                        ]}
                        tableRows={questionData}
                        title="Feedback Rating Statistics "
                        onTableRowClick={handleRowClick}
                        chartRowsCount={questionData.length}
                    />
                </>
        }
        </>
    );
};

export default FeedbackList;
