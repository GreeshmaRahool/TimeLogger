import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import React from 'react'
import { logTime } from '../api/projects'
import { TimeLog } from '../types/types'
import { formattedDate } from '../utils/dateutils'

interface AddTimeLogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  projectId: number;
  projectName: string;
}

function AddTimeLog({ isOpen, setIsOpen, projectId, projectName }: AddTimeLogProps) {
  let [logDate, setDate] = useState(formattedDate(new Date().toISOString()))
  let [logDescription, setDescription] = useState('')
  let [logInMinutes, setLogInMinutes] = useState(0)
  let [errorMessage, setErrorMessage] = useState('') // new state variable for error message
  
  useEffect(() => {
    if (isOpen) {
      setDate(formattedDate(new Date().toISOString()));
    }
  }, [isOpen, formattedDate]);

  function closeModal() {
    setIsOpen(false)
  }

    async function addLog() {
      console.log('Add Log');
      console.log(projectId, logDescription, logInMinutes, logDate, projectName);

      const log: TimeLog = {
        description: logDescription,
        date: logDate,
        durationInMinutes: logInMinutes
      };

      try {
        await logTime(projectId, log);
        setErrorMessage(''); // clear error message on successful log
        closeModal();
      } catch (error: any) { // Remove type annotation from catch clause variable
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
                    Add Time Time logs: # {projectId} - {projectName}
                  </Dialog.Title>
                  <div className="flex flex-col items-center w-full max-w-md mt-2">
                    <input type="text" className="border rounded-lg mb-2 py-2 px-4 w-full" placeholder="Description"
                      onChange={(e) => { setDescription(e.target.value) }}
                     />
                    <input type="text" className="border rounded-lg mb-2 py-2 px-4 w-full" placeholder="Time in Minutes" 
                      onChange={(e) => { setLogInMinutes( Number(e.target.value)) }}
                    />
                    <input type="date" className="border rounded-lg py-2 px-4 w-full" placeholder="Date" 
                      value={logDate}
                      onChange={(e) => { setDate( e.target.value) }}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="mt-4">
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                    <button
                      type="button"
                      className="bg-blue-500 hover:bg-blue-700 text-white rounded-full py-2 px-4 ml-2"
                      onClick={addLog}
                    >
                      Log Time
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

export default AddTimeLog;