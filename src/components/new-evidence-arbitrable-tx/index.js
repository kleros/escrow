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
        let errors = {}
        if (values.name.length > 55)
          errors.name = 'Number of characters for the name allowed is exceeded. The maximum is 55 characters.'
        if (values.description.length > 1000000)
          errors.description = 'The maximum numbers of the characters for the description is 1,000,000 characters.'
        return errors
      }}
      onSubmit={evidence => submitEvidence(evidence, id)}
    >
      {({ setFieldValue, isSubmitting }) => (
        <Form>
          <div className='NewEvidenceArbitrableTx-form'>
            <Field className='NewEvidenceArbitrableTx-form-input' name='name' placeholder='Name' />
            <ErrorMessage name='name' component='div' className='error' />

            <Field className='NewEvidenceArbitrableTx-form-textarea' component='textarea' name='description'>Description</Field>
            <ErrorMessage name='description' component='div' className='error' />

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
            <Button type='submit' disabled={isSubmitting}>
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
