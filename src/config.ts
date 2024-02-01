type RouterDataType = typeof routersData

export type RouterKeys = keyof RouterDataType

export const routersData = {
    // Page 01：登录
    login: {
        path: '/login',
        hasMenu: false
    },
    // Page 02：个人信息录入（学生 管理员）
    person_info: {
        path: '/person_info',
        hasMenu: false
    },
    // Page 03：考题选择（学生）
    exam_select: {
        path: '/exam_select',
        hasMenu: true,
    },
    // Page 04：考试（学生）
    exam: {
        path: '/exam/:exam_id',
        hasMenu: true,
    },
    // Page 05：学生考试记录（学生）
    exam_history: {
        path: '/exam_history',
        hasMenu: true,
    },
    // Page 06：查看试卷（学生 管理员）
    read_exam: {
        path: '/read_exam/:exam_id',
        hasMenu: true,
    },
    // Page 07：批阅试卷列表（管理员）
    corret_exam_list: {
        path: '/corret_exam_list',
        hasMenu: false,
    },
    // Page 08：批改试卷（管理员）
    corret_exam: {
        path: '/corret_exam/:exam_id',
        hasMenu: true,
    },
    // Page 09：学生管理（管理员）
    student_manage: {
        path: '/student_manage',
        hasMenu: true,
    },
    // Page 10：课程管理（管理员）
    subject_manage: {
        path: '/subject_manage',
        hasMenu: true,
    },
    // Page 11：考题录入（管理员）
    subject_add: {
        path: '/subject_add',
        hasMenu: true,
    },
    // Page 12：管理员管理（超级管理员）
    admin_manage: {
        path: '/admin_manage',
        hasMenu: true,
    }
}

export const studentMenus = [
    {
        label: '考题选择',
        key: 'exam_select'
    },
    {
        label: '考试记录',
        key: 'exam_history'
    }
]

export const adminMenus = [
    {
        label: '阅卷列表',
        key: 'corret_exam_list'
    },
    {
        label: '考题管理',
        key: 'subject_add'
    },
    {
        label: '课程管理',
        key: 'subject_manage'
    },
    {
        label: '学员管理',
        key: 'student_manage'
    }
]

export const superAdminMenus = [
    {
        label: '阅卷列表',
        key: 'corret_exam_list'
    },
    {
        label: '考题管理',
        key: 'subject_add'
    },
    {
        label: '课程管理',
        key: 'subject_manage'
    },
    {
        label: '学员管理',
        key: 'student_manage'
    },
    {
        label: '管理员管理',
        key: 'admin_manage'
    }
]