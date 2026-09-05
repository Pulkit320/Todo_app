function Search({searchTerm, setSearchTerm}){
    return (
        <div className = "search-tab">
            <input type="text" value = {searchTerm} onChange = {(e)=>setSearchTerm(e.target.value)}/>
        </div>
    )
}

export default Search;