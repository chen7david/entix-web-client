import { Button, Form, Input } from 'antd'
import { useState } from 'react'
import { CloseOutlined } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'
import { createSessionWords } from '@/api/clients/session-words.cient'

export const SessionNotesCard = ({
  sessionId,
}: {
  sessionId: string | number
}) => {
  const [words, setWords] = useState<string[]>([])
  const [newWord, setNewWord] = useState<string>('')

  const createSessionWordBulkMutation = useMutation({
    mutationFn: createSessionWords,
  })

  // Function to remove a word by index
  const removeWord = (index: number) => {
    const updatedWords = words.filter((_, i) => i !== index)
    setWords(updatedWords)
  }

  const addWord = (word: string) => {
    if (word) {
      if (!words.includes(word.trim())) {
        setWords([...words, word.trim()])
      }
      setNewWord('') // Clear the input field
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault() // Prevent the default action
      addWord(newWord) // Trigger adding the word
    }
  }

  const handleSubmit = () => {
    // Process the words here (e.g., send to an API or save to local storage)
    console.log('Words submitted:', words)
    createSessionWordBulkMutation.mutate({
      sessionId,
      words,
    })
    // Optionally, you can clear the list after submission
    // setWords([])
  }

  return (
    <div className="bg-gray-100 w-72 h-80 p-4 rounded-lg flex flex-col">
      <Form className="mb-3">
        <Form.Item>
          <Input
            type="text"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a word"
            spellCheck="true" // Enable spell checking
            className="border-none rounded-md"
          />
        </Form.Item>
        <Form.Item>
          <Button
            loading={createSessionWordBulkMutation.isPending}
            type="primary"
            onClick={handleSubmit}
            className="w-full"
          >
            Save Words
          </Button>
        </Form.Item>
      </Form>
      <div className="flex-1 overflow-y-auto">
        {words.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-500 text-sm">
            No words yet
          </div>
        ) : (
          [...words].reverse().map((word, index) => (
            <div
              key={index}
              className="flex justify-between border-dashed border-gray-300 border-1 px-3 py-1 mb-1 rounded-lg items-center bg-white"
            >
              <div className="text-gray-800 text-sm font-medium">
                <span>{words.length - index}. </span>
                <span>{word}</span>
              </div>
              <Button
                shape="circle"
                size="small" // Smaller size
                type="text"
                icon={<CloseOutlined />}
                onClick={() => removeWord(words.length - index - 1)} // Correct index for removal
                className="text-red-500"
              />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
