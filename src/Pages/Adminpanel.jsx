import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axiosClient from './axiosclient';

// Zod schema matching the problem schema
const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required'),
    })
  ).min(1, 'At least one visible test case required'),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
    })
  ).min(1, 'At least one hidden test case required'),
  startCode: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      initialCode: z.string().min(1, 'Initial code is required'),
    })
  ).length(3, 'All three languages required'),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      completeCode: z.string().min(1, 'Complete code is required'),
    })
  ).length(3, 'All three languages required'),
});

const languages = ['C++', 'Java', 'JavaScript'];

const emptyForm = {
  title: '',
  description: '',
  difficulty: 'easy',
  tags: 'array',
  visibleTestCases: [{ input: '', output: '', explanation: '' }],
  hiddenTestCases: [{ input: '', output: '' }],
  startCode: languages.map((language) => ({ language, initialCode: '' })),
  referenceSolution: languages.map((language) => ({ language, completeCode: '' })),
};

export default function AdminPanel() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: emptyForm,
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible,
  } = useFieldArray({ control, name: 'visibleTestCases' });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden,
  } = useFieldArray({ control, name: 'hiddenTestCases' });

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      await axiosClient.post('/problem/create', data);
      alert('Problem created successfully!');
      navigate('/');
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl p-6">
      <h1 className="mb-2 text-3xl font-bold">Create New Problem</h1>
      <p className="mb-6 text-base-content/70">
        Add problem details, test cases, starter code, and reference solutions.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <section className="card bg-base-100 p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold">Basic Information</h2>
          <div className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                {...register('title')}
                placeholder="Enter problem title"
                className={`input input-bordered ${errors.title ? 'input-error' : ''}`}
              />
              {errors.title && (
                <span className="mt-1 text-sm text-error">{errors.title.message}</span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                {...register('description')}
                placeholder="Describe the problem..."
                className={`textarea textarea-bordered h-32 ${
                  errors.description ? 'textarea-error' : ''
                }`}
              />
              {errors.description && (
                <span className="mt-1 text-sm text-error">
                  {errors.description.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="form-control w-full sm:w-1/2">
                <label className="label">
                  <span className="label-text">Difficulty</span>
                </label>
                <select
                  {...register('difficulty')}
                  className={`select select-bordered ${
                    errors.difficulty ? 'select-error' : ''
                  }`}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="form-control w-full sm:w-1/2">
                <label className="label">
                  <span className="label-text">Tag</span>
                </label>
                <select
                  {...register('tags')}
                  className={`select select-bordered ${
                    errors.tags ? 'select-error' : ''
                  }`}
                >
                  <option value="array">Array</option>
                  <option value="linkedList">Linked List</option>
                  <option value="graph">Graph</option>
                  <option value="dp">DP</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Visible Test Cases */}
        <section className="card bg-base-100 p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Visible Test Cases</h2>
            <button
              type="button"
              onClick={() =>
                appendVisible({ input: '', output: '', explanation: '' })
              }
              className="btn btn-sm btn-primary"
            >
              + Add Visible Case
            </button>
          </div>

          {visibleFields.map((field, index) => (
            <div key={field.id} className="mb-5 rounded-box border border-base-300 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-medium">Visible Case {index + 1}</h3>
                {visibleFields.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-xs btn-error btn-outline"
                    onClick={() => removeVisible(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="space-y-3">
                <Field
                  label="Input"
                  error={errors.visibleTestCases?.[index]?.input?.message}
                  registration={register(`visibleTestCases.${index}.input`)}
                  placeholder="Example: nums = [1, 2, 3]"
                />
                <Field
                  label="Output"
                  error={errors.visibleTestCases?.[index]?.output?.message}
                  registration={register(`visibleTestCases.${index}.output`)}
                  placeholder="Expected output"
                />
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Explanation</span>
                  </label>
                  <textarea
                    {...register(`visibleTestCases.${index}.explanation`)}
                    placeholder="Explain why this is the output"
                    className={`textarea textarea-bordered ${
                      errors.visibleTestCases?.[index]?.explanation
                        ? 'textarea-error'
                        : ''
                    }`}
                  />
                  {errors.visibleTestCases?.[index]?.explanation && (
                    <span className="mt-1 text-sm text-error">
                      {errors.visibleTestCases[index].explanation.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {errors.visibleTestCases?.root?.message && (
            <p className="text-sm text-error">{errors.visibleTestCases.root.message}</p>
          )}
          {errors.visibleTestCases?.message && (
            <p className="text-sm text-error">{errors.visibleTestCases.message}</p>
          )}
        </section>

        {/* Hidden Test Cases */}
        <section className="card bg-base-100 p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Hidden Test Cases</h2>
            <button
              type="button"
              onClick={() => appendHidden({ input: '', output: '' })}
              className="btn btn-sm btn-primary"
            >
              + Add Hidden Case
            </button>
          </div>

          {hiddenFields.map((field, index) => (
            <div key={field.id} className="mb-5 rounded-box border border-base-300 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-medium">Hidden Case {index + 1}</h3>
                {hiddenFields.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-xs btn-error btn-outline"
                    onClick={() => removeHidden(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label="Input"
                  error={errors.hiddenTestCases?.[index]?.input?.message}
                  registration={register(`hiddenTestCases.${index}.input`)}
                  placeholder="Test input"
                />
                <Field
                  label="Output"
                  error={errors.hiddenTestCases?.[index]?.output?.message}
                  registration={register(`hiddenTestCases.${index}.output`)}
                  placeholder="Expected output"
                />
              </div>
            </div>
          ))}
          {errors.hiddenTestCases?.root?.message && (
            <p className="text-sm text-error">{errors.hiddenTestCases.root.message}</p>
          )}
          {errors.hiddenTestCases?.message && (
            <p className="text-sm text-error">{errors.hiddenTestCases.message}</p>
          )}
        </section>

        {/* Starter Code */}
        <section className="card bg-base-100 p-6 shadow-lg">
          <h2 className="mb-2 text-xl font-semibold">Starter Code</h2>
          <p className="mb-4 text-sm text-base-content/70">
            Provide the code template users will begin with for each language.
          </p>
          {languages.map((language, index) => (
            <div key={language} className="mb-5">
              <h3 className="mb-2 font-medium">{language}</h3>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Initial Code</span>
                </label>
                <textarea
                  {...register(`startCode.${index}.initialCode`)}
                  spellCheck={false}
                  placeholder={`Enter ${language} starter code`}
                  className={`textarea textarea-bordered min-h-36 font-mono text-sm ${
                    errors.startCode?.[index]?.initialCode ? 'textarea-error' : ''
                  }`}
                />
                {errors.startCode?.[index]?.initialCode && (
                  <span className="mt-1 text-sm text-error">
                    {errors.startCode[index].initialCode.message}
                  </span>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* Reference Solutions */}
        <section className="card bg-base-100 p-6 shadow-lg">
          <h2 className="mb-2 text-xl font-semibold">Reference Solutions</h2>
          <p className="mb-4 text-sm text-base-content/70">
            Add the complete solution for each language.
          </p>
          {languages.map((language, index) => (
            <div key={language} className="mb-5">
              <h3 className="mb-2 font-medium">{language}</h3>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Complete Code</span>
                </label>
                <textarea
                  {...register(`referenceSolution.${index}.completeCode`)}
                  spellCheck={false}
                  placeholder={`Enter complete ${language} solution`}
                  className={`textarea textarea-bordered min-h-48 font-mono text-sm ${
                    errors.referenceSolution?.[index]?.completeCode
                      ? 'textarea-error'
                      : ''
                  }`}
                />
                {errors.referenceSolution?.[index]?.completeCode && (
                  <span className="mt-1 text-sm text-error">
                    {errors.referenceSolution[index].completeCode.message}
                  </span>
                )}
              </div>
            </div>
          ))}
        </section>

        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => navigate(-1)}
            disabled={submitting}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              'Create Problem'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, error, registration, placeholder }) {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <input
        {...registration}
        placeholder={placeholder}
        className={`input input-bordered ${error ? 'input-error' : ''}`}
      />
      {error && <span className="mt-1 text-sm text-error">{error}</span>}
    </div>
  );
}
