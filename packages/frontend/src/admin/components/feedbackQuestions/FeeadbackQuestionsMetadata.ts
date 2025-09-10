import { FieldConfig } from "../forms/Form";

export interface FeedbackQuestion {
    id: string,
    question_text: string;
    is_active: boolean;
    number: number;
    created_at: String;
    updated_at: String;
}

export const feedbackMetadata: FieldConfig[] = [
    {
        name: "question_text",
        label: "Question Text",
        required: true
    },
    {
        name: "is_active",
        label: "Is Active",
        type: "boolean",
        required: true
    },
];
