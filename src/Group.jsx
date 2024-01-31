import types from 'prop-types'
import { useEffect, useRef, useState } from 'react';

export function Group ({ group }) {
  const parentRef = useRef()
  const draggingRef = useRef()
  const [isDragging, setDragging] = useState()
  
  const onHandleMouseDown = () => {
    parentRef.current.setAttribute('draggable', 'true')
  }

  const onHandleMouseUp = () => {
    parentRef.current.setAttribute('draggable', 'false')
  }
  
  const onDragStart = () => {
    console.log('log - onDragStart:', group)
  }

  const onDragEnter = (event) => {
    console.log('log - onDragEnter')
    
    const transferId = event.dataTransfer.getData('id');
    
    if(transferId === group.id) return ;

    console.log('log - onDragEnter', parentRef.current)
    
    parentRef.current.parentNode.style.borderBottom = `2px solid black`
  }

  const onDragLeave = (event) => {
    console.log('log - onDragLeave', group.id)

    const transferId = event.dataTransfer.getData('id');

    if(transferId === group.id) return ;

    parentRef.current.parentNode.style.borderBottom = `2px solid transparent`
  }

  const onDragOver = (event) => {
    event.preventDefault();
    return true;
  }

  const onDrop = (event) => {

    onHandleMouseUp()
    onDragLeave(event)

    const transferId = event.dataTransfer.getData('id');

    if(transferId === group.id) {
      /* empty */
    }
  }

  useEffect(() => {
    const onMouseUp = () => {
      console.log('log - onMouseUp: ', draggingRef.current)
      if (draggingRef.current) {
        setDragging(false)
        draggingRef.current = false
      } else {
        setDragging(true)
        draggingRef.current = true
      }
    }

    document.body.addEventListener('drop', onMouseUp, false)

    return () => {
      document.body.removeEventListener('drop', onMouseUp, false)
    }
  },[])

  return (
    <div
      className='group-item'
      ref={parentRef}
      style={{ display: "flex", justifyContent: "space-between", alignItems: 'center' }}
      onDrop={onDrop}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDragStart={onDragStart}
    >
      <span>{group.title} - { isDragging }</span>
      <svg
        className="drag-handler"
        onMouseDown={onHandleMouseDown}
        onMouseUp={onHandleMouseUp}
        width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"
        style={group.id !== '8' ? { pointerEvents: 'none', userSelect:'none' } : {}} >
        <path d="M2.8 5.2L1 7M1 7L2.8 8.8M1 7H13M5.2 2.8L7 1M7 1L8.8 2.8M7 1V13M8.8 11.2L7 13M7 13L5.2 11.2M11.2 5.2L13 7M13 7L11.2 8.8" stroke="#A4A4A4" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

Group.propTypes = {
  count: types.number,
  onCount: types.func,
  group: types.any,
  onSwapGroup: types.func
}
