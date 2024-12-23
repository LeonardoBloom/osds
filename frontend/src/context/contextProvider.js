import myContext from "./myContext";

function contextProvider() {

    return (
        <myContext.Provider value="dummy data">

        </myContext.Provider>
    )

}

export default contextProvider;