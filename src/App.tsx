import './App.scss';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './common_components/layout';
import { routersData } from './config';

import Login from '@/pages/login';
import PersonInfo from './pages/person_info';
import ExamSelect from './pages/exam_select';
import Exam from './pages/exam';
import ExamHistory from './pages/exam_history';
import ReadExam from './pages/read_exam';
import CorretExamList from './pages/corret_exam_list';
import CorretExam from './pages/corret_exam';
import StudentManage from './pages/student_manage';
import SubjectManage from './pages/subject_manage';
import SubjectAdd from './pages/subject_add';
import AdminManage from './pages/admin_manage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<Navigate to={'/login'}></Navigate>} />
        {/* Page 01：登录 */}
        <Route path={routersData.login.path} element={<Login />} />
        {/* Page 02：个人信息录入（学生 管理员） */}
        <Route path={routersData.person_info.path} element={<PersonInfo />} />
        {/* Page 03：考题选择（学生） */}
        <Route path={routersData.exam_select.path} element={<ExamSelect />} />
        {/* Page 04：考试（学生） */}
        <Route path={routersData.exam.path} element={<Exam />} />
        {/* Page 05：学生考试记录（学生） */}
        <Route path={routersData.exam_history.path} element={<ExamHistory />} />
        {/* Page 06：查看试卷（学生 管理员） */}
        <Route path={routersData.read_exam.path} element={<ReadExam />} />
        {/* Page 07：批阅试卷列表（管理员） */}
        <Route path={routersData.corret_exam_list.path} element={<CorretExamList />} />
        {/* Page 08：批改试卷（管理员） */}
        <Route path={routersData.corret_exam.path} element={<CorretExam />} />
        {/* Page 09：学生管理（管理员） */}
        <Route path={routersData.student_manage.path} element={<StudentManage />} />
        {/* Page 10：课程管理（管理员） */}
        <Route path={routersData.subject_manage.path} element={<SubjectManage />} />
        {/* Page 11：考题录入（管理员） */}
        <Route path={routersData.subject_add.path} element={<SubjectAdd />} />
        {/* Page 12：管理员管理（超级管理员） */}
        <Route path={routersData.admin_manage.path} element={<AdminManage />} />
      </Route>
    </Routes>
  );
}

export default App;
