import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { addFeedbackQuestion, fetchFeedbackQuestions, updateFeedbackQuestion } from './FeedbackQuestionsThunks';
import { FeedbackQuestion } from './FeeadbackQuestionsMetadata';
import { feedbackMetadata } from './FeeadbackQuestionsMetadata'
import DataTable from '../table/table';
import './FeedbackQuestions.css';
import GenericForm from '../forms/Form';
import { Modal, Backdrop, Fade, Box } from '@mui/material';
import { styleModal } from '../forms/Form';

const FeedbackQuestions: React.FC = () => {

  const [data, setData] = useState<any>({});
  const [showAddModal, setShowAddModal] = useState(false);

  const openAddUserModal = () => {
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
  };

  const dispatch = useAppDispatch();

  const { questions, loading, error } = useAppSelector(
    (state) => state.feedbackQuestions
  );


  useEffect(() => {

    dispatch(fetchFeedbackQuestions());

    let columns: object[] = [];

    for (const k in questions[0]) {
      columns.push({ id: k, label: k.charAt(0).toUpperCase() + k.slice(1).replace('_', ' ') })
    }

    let rows: Partial<FeedbackQuestion>[] = questions;

    setData({ columns, rows });

  }, [dispatch, questions]);

  return (
    <>
      <h1>Feedback Questions</h1>

      <div id="options-bar">
        <button onClick={openAddUserModal}>Add question</button>
      </div>

      <DataTable
        data={data}
        showDelete={false}
        fields={feedbackMetadata}
        title={'Update Feedback Question'}
        onSubmit={(data: any) => {dispatch(updateFeedbackQuestion(data));}}
      />

      <Modal
        open={showAddModal}
        onClose={closeAddModal}
        aria-labelledby="add-user-modal-title"
        aria-describedby="add-user-modal-description"
        closeAfterTransition
        keepMounted
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
            sx: { backgroundColor: 'transparent' }
          },
        }}
      >
        <Fade in={showAddModal}>
          <Box sx={styleModal}>
            <GenericForm
              title={'Add Feedback Question'}
              fields={feedbackMetadata}
              initialState={{ is_active: false }}
              onSubmit={(data: any) => dispatch(addFeedbackQuestion(data))}
              onClose={closeAddModal}
            />
          </Box>
        </Fade>
      </Modal>

    </>
  );
};

export default FeedbackQuestions;
