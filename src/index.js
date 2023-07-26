import { Client } from '@notionhq/client'
import { getAllNotes } from './markdown.js'

const token = process.env.NOTION_TOKEN
const DBID = process.env.NOTION_DB_DEV

async function main() {
  const notion = new Client({ auth: token })
  // const DB = await notion.databases.retrieve({ database_id: DBID })

  const notes = getAllNotes('../notes')
  const failedNotes = []

  for (const note of notes) {
    try {
      await notion.pages.create({
        parent: { database_id: databaseId },
        properties: {
          // プロパティ名はcase sensitive
          Name: {
            type: 'title',
            title: [{ text: { content: note.name } }],
          },
          Tags: {
            type: 'multi_select',
            multi_select: note.tags.map(tag => ({ name: tag })),
          },
        },
        children: note.body,
      })
    } catch (e) {
      console.error(`${note.name}の追加に失敗:`, e)
      failedNotes.push(note.name)
    }
  }

  console.log('ページ作成に失敗したノート:', failedNotes)
}

main()
