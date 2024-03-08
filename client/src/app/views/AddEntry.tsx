import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import React from 'react'
import { createNew } from '../api/projects'

interface AddEntryProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onNewProject(): void;
}


function AddEntry({ isOpen, setIsOpen, onNewProject }: AddEntryProps) {
  let [projectName, setProjectName] = useState('')
  let [projectDeadline, setDeadline] = useState('')
  let [errorMessage, setErrorMessage] = useState('') // new state variable for error message

  function closeModal() {
    setIsOpen(false)
  }

  async function createProject() {
    try {
      const response = await createNew({ name: projectName, deadline: projectDeadline });
      console.log(response);
      onNewProject();
      setErrorMessage(''); // clear error message on successful creation
      closeModal();
    } catch (error: any) {
      setErrorMessage(error.message); // set error message on failure
    }
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Create a new project
                  </Dialog.Title>
                  <div className="flex flex-col items-center w-full max-w-md mt-2">
                    <input type="text" className="border rounded-lg mb-2 py-2 px-4 w-full" placeholder="Project Name"
                    onChange={(e) => { setProjectName(e.target.value) }}
                     />
                    <input type="date" className="border rounded-lg py-2 px-4 w-full"
                      placeholder="Deadline"
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => { setDeadline(e.target.value) }}
                    />
                  </div>


                  <div className="mt-4">
                    { errorMessage && <p className="text-red-500">{errorMessage}</p> }
                    <button
                      type="button"
                      className="bg-blue-500 hover:bg-blue-700 text-white rounded-full py-2 px-4 ml-2"
                      onClick={createProject}
                    >
                      Create
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default AddEntry;