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

  const { questions } = useAppSelector(
    (state) => state.feedbackQuestions
  );


  useEffect(() => {

    dispatch(fetchFeedbackQuestions());



    let columns: object[] = [];

    if (questions.length) {
      for (const k in questions[0]) {
        columns.push({ id: k, label: k.charAt(0).toUpperCase() + k.slice(1).replace('_', ' ') })
      }

      let rows: Partial<FeedbackQuestion>[] = questions;

      setData({ columns, rows });

    }
  }, [dispatch, questions]);

  return (
    <>
      <h1>Feedback Questions</h1>

      {!questions.length ?
        <>
          <div
            className="no-data"
            role="status"
            aria-live="polite"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 320,
              padding: 24,
              textAlign: 'center',
              color: '#444',
              background: 'transparent',
            }}
          >
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>No data to display</div>
              <div style={{ fontSize: 14, color: '#666' }}>No records matched the criteria</div>
            </div>
          </div>
        </>
        : <>
          <div id="options-bar">
            <button onClick={openAddUserModal}>Add question</button>
          </div>


          <DataTable
            data={data}
            showDelete={false}
            fields={feedbackMetadata}
            title={'Update Feedback Question'}
            onSubmit={(data: any) => { dispatch(updateFeedbackQuestion(data)); }}
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

        </>}
    </>
  );
};

export default FeedbackQuestions;
