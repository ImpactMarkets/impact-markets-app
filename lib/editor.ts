import DOMPurify from 'isomorphic-dompurify'
import { marked } from 'marked'
import toast from 'react-hot-toast'
import { Cursor } from 'textarea-markdown-editor'

import { uploadImage } from '@/lib/cloudinary'

export function markdownToHtml(markdown: string) {
  return DOMPurify.sanitize(marked.parse(markdown, { breaks: true }))
}

export function markdownToPlainHtml(markdown: string) {
  return DOMPurify.sanitize(marked.parse(markdown, { breaks: true }), {
    ALLOWED_TAGS: ['em'],
    ALLOWED_ATTR: [],
    FORBID_CONTENTS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
  }).trim()
}

function replacePlaceholder(
  cursor: Cursor,
  placeholder: string,
  replaceWith: string,
) {
  cursor.setValue(cursor.value.replace(placeholder, replaceWith))
}

export function uploadImageCommandHandler(
  textareaEl: HTMLTextAreaElement,
  files: File[],
) {
  const cursor = new Cursor(textareaEl)
  const currentLineNumber = cursor.position.line

  files.forEach(async (file) => {
    const placeholder = `![Uploading ${file.name}...]()`

    cursor.replaceLine(currentLineNumber.lineNumber, placeholder)

    try {
      const uploadedImage = await uploadImage(file)

      replacePlaceholder(
        cursor,
        placeholder,
        `<img width="${
          uploadedImage.dpi >= 144
            ? Math.round(uploadedImage.width / 2)
            : uploadedImage.width
        }" alt="${uploadedImage.originalFilename}" src="${uploadedImage.url}">`,
      )
    } catch (error: any) {
      console.log(error)
      replacePlaceholder(cursor, placeholder, '')
      toast.error(`Error uploading image: ${error.message}`)
    }
  })
}

export function getSuggestionData(textareaEl: HTMLTextAreaElement): {
  keystrokeTriggered: boolean
  triggerIdx: number
  type: 'mention' | 'emoji'
  query: string
} {
  const positionIndex = textareaEl.selectionStart
  const textBeforeCaret = textareaEl.value.slice(0, positionIndex)

  const tokens = textBeforeCaret.split(/\s/)
  const lastToken = tokens[tokens.length - 1]

  const triggerIdx = textBeforeCaret.endsWith(lastToken)
    ? textBeforeCaret.length - lastToken.length
    : -1

  const maybeTrigger = textBeforeCaret[triggerIdx]
  const mentionKeystrokeTriggered = maybeTrigger === '@'
  const emojiKeystrokeTriggered = maybeTrigger === ':'
  const keystrokeTriggered =
    mentionKeystrokeTriggered || emojiKeystrokeTriggered
  const type = mentionKeystrokeTriggered ? 'mention' : 'emoji'

  const query = textBeforeCaret.slice(triggerIdx + 1)

  return {
    keystrokeTriggered,
    triggerIdx,
    type,
    query,
  }
}
