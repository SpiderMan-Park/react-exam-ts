import ListTable from "./ListTable";
import Modal from './Modal'
import Search from "./Search";
import useRenderCheck from '@/hooks/renderCheck';

function StudentManage() {

    useRenderCheck('StudentManage')

    return (
        <div className="wrap">
            <Search></Search>
            <ListTable />
            <Modal />
        </div>
    )
}

export default StudentManage