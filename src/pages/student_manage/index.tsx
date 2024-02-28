import ListTable from "./ListTable";

import Modal from './Modal'
import Search from "./Search";

function StudentManage() {
    return (
        <div className="wrap">
            <Search></Search>
            <ListTable />
            <Modal />
        </div>
    )
}

export default StudentManage