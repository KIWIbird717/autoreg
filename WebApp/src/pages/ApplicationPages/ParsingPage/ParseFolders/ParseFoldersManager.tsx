import React from 'react'
import { Folders } from './Folders'
import { Accounts } from './Accounts'
import { useSelector } from 'react-redux'
import { StoreState } from '../../../../store/store'
import { Groups } from './Groups'


export const ParseFoldersManager = () => {
  const selectedFolder = useSelector((state: StoreState) => state.app.parseManagerFolder)
  const parseFolders = useSelector((state: StoreState) => state.user.userParsingFolders)
  const currentParseFolder = parseFolders?.filter((folder) => folder.key === selectedFolder)[0]

  return (
    <div>
      {selectedFolder ? (
        currentParseFolder?.type === 'accounts' ? (
          <Accounts />
        ) : (
          <Groups />
        )
      ) : (
        <Folders />
      )}
    </div>
  )
}
