import { useEffect, useState } from 'react';
import supabase from './supabase';
import "./style.css";
import { AuthImplicitGrantRedirectError } from '@supabase/supabase-js';


const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];

function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

function App(){
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const[showLoader, setShowLoader] = useState(false);
  const[currentCat, setCurrentCat] = useState('all');


  useEffect(function(){
  
  async function getDataFromSupabase() {
    setShowLoader(true)
    let query = supabase.from("facts").select("*");
    if (currentCat != 'all') {
      query = query.eq("category", currentCat);
    }

    const { data: facts, error } = await query
      .order("votesInteresting", { ascending: true })
      //.limit(2);    
    
    if (!error) setFacts(facts);
    else alert("alert there is an error");

    setShowLoader(false);
  }
  getDataFromSupabase();
  },[currentCat]);
  return (
    <>
      {/* Header Section */}
      <Header setShowForm={setShowForm}></Header>
      {/* Form Section */}
      {showForm ? (
        <CreateFactForm
          setFacts={setFacts}
          setShowForm={setShowForm}
        ></CreateFactForm>
      ) : null}

      <main className="main">
        <CategoryList setCurrentCat={setCurrentCat}></CategoryList>
        {showLoader ? (
          <Loader></Loader>
        ) : (
          <FactContainer facts={(facts)} setFacts={setFacts}></FactContainer>
        )}
      </main>
    </>
  );
}

function Loader(){
  return (
    <div className='Loading'>Loading</div>
  )
}

function Header({showForm,setShowForm }) {
  return (
    <header className="header">
      <div className="logo">
        <img src="logo.png" height="68" width="68" alt="Today I Learned Logo" />
        <h1>Today I Learned</h1>
      </div>

      <button
        className="btn btn-large sharebtn"
        onClick={() =>
          setShowForm(
            (cState) =>
              //cState == true ? false : true OR
              !cState
          )
        }
      >
        {showForm ? 'Close' : 'Share a fact'}
      </button>
    </header>
  );
}

function CreateFactForm({ setFacts, setShowForm }) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setUpload] = useState(false)
  const textLength = text.length;
  async function handleSubmit(e) {
    // 1. prevent the browser reload
    e.preventDefault();
    //2. if Data is valid, if so then create a new Fact
    if (text && isValidHttpUrl(source) && category && textLength <= 200) {
      console.log("Valid Data");
      // 3. Create a new Fact Object
      // const newFact = {
      //   id: Math.floor(Math.random() * 100),
      //   text: text,
      //   source: source,
      //   category: category,
      //   votesInteresting: 0,
      //   votesMindblowing: 0,
      //   votesFalse: 0,
      //   createdIn: new Date().getFullYear(),
      // };

     //3. Upload a new fact to the Supabase and receive the new fact object   

setUpload(true);
 const {data:newFact,error} =  await supabase
    .from("facts")
    .insert([
      {
        text,
        source,
        category,
      },
    ])
    .select();
      setUpload(false);



      // 4. Add the new Fact to the UI
      if (!error) setFacts((facts) => [newFact[0], ...facts]);
      // 5. Reset Input Fields
      setText("");
      setSource("");
      setCategory("");
      // 6. Close the form
      setShowForm(false);
    }
  }

  return (
    //<form className="fact-form" onSubmit={(e) => handleSubmit(e)}> OR
    <form className="fact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Share a fact with the world..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <span>{200 - textLength}</span>
      <input
        type="text"
        value={source}
        placeholder="Trustworthy source..."
        onChange={(e) => setSource(e.target.value)}
      />
      <select onChange={(e) => setCategory(e.target.value)} value={category}>
        <option value="">Choose category:</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className="btn btn-large" disabled={isUploading}>Post</button>
    </form>
  );
}


function CategoryList({setCurrentCat}) {
  return (
    <aside>
      <ul>
        <li className="category">
          <button
            className="btn btn-all-categories"
            onClick={() => setCurrentCat("all")}
          >
            All
          </button>
        </li>

        {CATEGORIES.map((cat) => (
          <li className="category" key={cat.name}>
            <button
              className="btn btn-category"
              style={{ backgroundColor: cat.color }}
              onClick={() => setCurrentCat(cat.name)}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function FactContainer({ facts, setFacts }) {
if (facts.length == 0){
  return (
    <div className="Loading">
      There are no facts in this category. Share one now!
    </div>
  );
}


  return (
    <>
      <section>
        <ul className="facts-list">
          {facts.map((fact) => (
            <Facts key={fact.id} fact={fact} setFacts={setFacts}></Facts>
          ))}
        </ul>
        <p>There are {facts.length} facts in the data base. Add your own! </p>
      </section>
    </>
  );
}


function Facts(props) {
  //const fact = props.factObj; // method one of destructring OR simply this like 
  const { fact, setFacts } = props;
  const [isUpdating, setisUpdating] = useState(false);
  const isDisputed = fact.votesInteresting + fact.votesMindBlowing < fact.votesFalse
  async function handleVote(string) {
  //console.log('button clicked');
   setisUpdating(true);
  const { data: updatedFact, error } = await supabase
    .from("facts")
    .update({ [string]: fact[string] + 1 })
    .eq("id", fact.id)
    .select();
 setisUpdating(false);
 
  if(!error) {
    setFacts((facts) => facts.map((f) => (f.id === fact.id ? updatedFact[0] : f)));
  }
  }
  return (
    <li key={fact.id} className="fact">
      <p>
        {isDisputed ? <span className="disputed">[DISPUTED] </span> : null}
        {fact.text}
        <a className="source" href={fact.source} target="_blank">
          (Source)
        </a>
      </p>
      <span
        className="tag"
        style={{
          backgroundColor: CATEGORIES.find((cat) => cat.name == fact.category)
            .color,
        }}
      >
        {fact.category}
      </span>
      <div className="vote-buttons">
        <button
          onClick={() => handleVote("votesInteresting")}
          disabled={isUpdating}
        >
          👍 {fact.votesInteresting}
        </button>
        <button
          onClick={() => handleVote("votesMindBlowing")}
          disabled={isUpdating}
        >
          🤯 {fact.votesMindBlowing}
        </button>
        <button onClick={() => handleVote("votesFalse")} disabled={isUpdating}>
          ⛔️ {fact.votesFalse}
        </button>
      </div>
    </li>
  );
}

export default App;