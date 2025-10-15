import { useState } from "react";

export function SideBarView(props) {
    const [expanded, setExpanded] = useState(false)

    return (
        <div className={`sidebar ${expanded ? "expanded" : "collapsed"}`}
        style={{
            width: expanded
              ? window.innerWidth > 250
                ? 250
                : window.innerWidth
              : 35,
              background: expanded ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0)", 
              transition: "width 0.3s ease, background 0.3s ease", 
          }}>
            <button onClick={ () => setExpanded(curr => !curr) } className={ expanded ? "sidebar-button-open" : "sidebar-button-closed"}> <i class="fa-solid fa-bars"></i></button>
        { expanded ?
        <table className="table">
        <tbody>
           <tr onClick={ () => setExpanded(curr => !curr) } >
            <button onClick={ handleHomePageACB }className="menu-item">
                <td><i class="fa-solid fa-house"></i></td>
                <td><div > Home </div></td>
            </button>
           </tr>
           <tr onClick={ () => setExpanded(curr => !curr) }>
            <button onClick={ handleSearchPageACB } className="menu-item">
                <td><i class="fa-solid fa-magnifying-glass"></i></td>
                <td><div> Search </div></td>
            </button>
           </tr>
           <tr onClick={ () => setExpanded(curr => !curr) }>
            <button onClick={ handleMyRecordsPageACB } className="menu-item">
                <td><i class="fa-solid fa-record-vinyl"></i></td>
                <td><div> MyRecords </div></td>
            </button>
           </tr>
           <tr onClick={ () => setExpanded(curr => !curr) }>
            <button onClick={ handleSocialPageACB } className="menu-item">
                <td><i class="fa-solid fa-user-group"></i></td>
                <td><div> Social </div></td>
            </button>
           </tr>
           <tr onClick={ () => setExpanded(curr => !curr) }>
            <button onClick={ handleAccountPageACB } className="menu-item">
                <td><i class="fa-solid fa-user"></i></td>
                <td><div> Account </div></td>
            </button>
           </tr>
        </tbody>
    </table>
    :
    null
    }</div>  
    );

    function handleHomePageACB() {
        window.location.hash="#/home"
    }

    function handleSearchPageACB() {
        window.location.hash="#/search"
    }

    function handleAccountPageACB() {
        window.location.hash="#/account"
    }

    function handleMyRecordsPageACB() {
        window.location.hash="#/myrecords"
    }

    function handleSocialPageACB() {
        window.location.hash="#/social"
    }

}