import React from 'react'
import PropTypes from 'prop-types'
import { Formik, Form, Field, ErrorMessage } from 'formik'

import Button from '../button'

import './new-evidence-arbitrable-tx.css'

const NewEvidenceArbitrableTx = ({ submitEvidence, id }) => (
  <div className='NewEvidenceArbitrableTx'>
    <div className='NewEvidenceArbitrableTx-message'><p>Create Evidence</p></div>
    <Formik
      initialValues={{name: '', description: '', file: ''}}
      validate = {values => {
        {/* TODO use Yup */}
      }}
      onSubmit={evidence => submitEvidence(evidence, id)}
    >
      {({ setFieldValue }) => (
        <Form>
          <div className='NewEvidenceArbitrableTx-form'>
            <Field className='NewEvidenceArbitrableTx-form-input' name='name' placeholder='Name' />
            <ErrorMessage name='name' component='div' />

            <Field className='NewEvidenceArbitrableTx-form-textarea' component='textarea' name='description'>Description</Field>
            <ErrorMessage name='description' component='div' className='def' />

            {/* hack Formik for file type */}
            {/* and store only the path on the file in the redux state */}
            <input id='file' name='file' type='file' onChange={e => {
                const file = e.currentTarget.files[0]
                return setFieldValue('file', {
                  dataURL: window.URL.createObjectURL(e.currentTarget.files[0]),
                  name: file.name
                })
              }
            } />
          </div>
          <div className='NewEvidenceArbitrableTx-footer'>
            <Button type='submit'>
              Submit Evidence
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  </div>
)

NewEvidenceArbitrableTx.propTypes = {
  // State
  formArbitrabletx: PropTypes.func
}

NewEvidenceArbitrableTx.defaultProps = {
  // State
  formArbitrabletx: v => v
}

export default NewEvidenceArbitrableTx