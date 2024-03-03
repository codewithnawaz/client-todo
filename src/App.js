import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [textItem, setTextItem] = useState('');
  const [listItem, setListItem] = useState([]);
  const [isUpdating, setIsUpdating] = useState('');
  const [updateText, setUpdateText] = useState('');

  //add item
  const addItem = async (e) => {
    try {
      e.preventDefault();
      const res = await axios.post('https://todo-4w21.onrender.com/api/postData', { item: textItem })
      // to render the list automatically when added new item
      setListItem(prev => [...prev, res.data]);
      setTextItem('')
    } catch (err) {
      console.log(err)
    }
  }

  //getList
  useEffect(() => {
    const getList = async () => {
      try {
        const res = await axios.get('https://todo-4w21.onrender.com/api/getData')
        setListItem(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    getList()
  }, [])

  //deleteItem

  const deleteItem = async (id) => {
    try {
      const res = await axios.delete(`https://todo-4w21.onrender.com/api/${id}`)
      console.log(res.data)
      const newListItem = listItem.filter(item => item._id !== id);
      //to render page automatically when deleted an item
      setListItem(newListItem)
    }
    catch (err) {
      console.log(err)
    }
  }

  //update item

  const updateItem = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`https://todo-4w21.onrender.com/api/${isUpdating}`, { item: updateText });
      // console.log(res.data)
      setUpdateText('');
      setIsUpdating('');
      console.log(res.data)
      const updateItemIndex = listItem.findIndex(item => item._id === isUpdating);
      const updatedItem = listItem[updateItemIndex].item = updateText;
    } catch (err) {
      console.log(err)
    }
  }

  //before update we need to show a input field where we will type our updated item

  const renderUpdateForm = () => (
    <form className='update-form mb-2' onSubmit={(e) => { updateItem(e) }}>
      <input className='w-[300px] p-3 border-border rounded-md' type="text" placeholder='update ...' onChange={(e) => { setUpdateText(e.target.value) }} value={updateText} />
      <button className='bg-yellow-400 ml-3 p-1 rounded-md text-white' type='submit'>Update</button>
    </form>
  )


  return (
    <div className="main pt-20">
      <div className="container bg-pink-100 text-center justify-center mx-auto p-2 max-w-[800px]">
        <div className="title-container mb-10">
          <h1 className='title text-5xl font-bold '>TO-DO</h1>
        </div>
        <form className='form-div' onSubmit={e => { addItem(e) }}>
          <div className="form-div flex gap-x-8 items-center justify-center text-center">
            <div className="input-div w-[300px]" >
              <input type="text" className='input-bar border-border rounded-md p-3 w-full' placeholder='Add...' onChange={e => { setTextItem(e.target.value) }} value={textItem} />
            </div>
            <div className="btn-container">
              <button className='bg-teal-500 hover:bg-teal-600 p-3 w-[100px] rounded-md text-white font-semibold text-[18px]' type='submit' >Add</button>
            </div>
          </div>
        </form>
        <div className="listItems mt-10 ">
          {
            listItem.map(item => (
              <>
                <div className=" max-w-[550px] mx-auto px-5">

                  {
                    isUpdating === item._id
                      ? renderUpdateForm()
                      : <>
                        <div className="text-div flex mx-auto mb-2 justify-between items-center justify-center text-center">
                          <div className='max-w-[350px] '>
                          <div className='text-lg mb-1 text-left'>{item.item}</div>
                          </div>
                          <div className="max-w-[200px]">
                            <button className='bg-blue-400 hover:bg-blue-500 ml-3 p-1 rounded-md text-white' onClick={() => { setIsUpdating(item._id) }}>Update</button>
                            <button className='bg-red-500 ml-3 hover:bg-red-600 p-1 rounded-md text-white' onClick={() => { deleteItem(item._id) }}>Delete</button>
                          </div>
                        </div>
                      </>
                  }
                </div>
                {/* <hr className='hr' /> */}
              </>
            ))
          }
        </div>
      </div>
    </div>

  );
}

export default App;
