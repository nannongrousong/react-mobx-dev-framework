import { message } from 'antd';

/**
 * 将一维的菜单数组递归转化为树形节点
 * @param {Array} nodeData 菜单数组
 */
export const createTreeNode = (nodeDataOrigin: any[]): any[] => {
    //  深拷贝一次。避免在非action处修改viewModel数据
    const nodeData = JSON.parse(JSON.stringify(nodeDataOrigin));
    const getNodesByParent = (parentID: number): any => (nodeData.filter((node: any): boolean => node.ParentID == parentID));
    const rootNodeID = 0;

    let treeNodes = [...getNodesByParent(rootNodeID)];

    const createNodes = (treeNodes: any /*, parentTitle = ''*/) => {
        for (let i in treeNodes) {
            //  treeNodes[i].ParentTitle = parentTitle;
            let childNodes: any = getNodesByParent(treeNodes[i].MenuID);
            if (childNodes.length) {
                treeNodes[i].Children = childNodes;
                createNodes(treeNodes[i].Children, treeNodes[i].Title);
            }
        }
    };

    createNodes(treeNodes);
    return treeNodes;
};

/**
 * 统一错误处理
 * @param {String|Error} err Error对象or字符串
 */
export const errorHandle = (err: string | any) => {
    if (err) {
        if (err.__proto__ == Error.prototype) {
            message.error(err.message);
        } else {
            message.error(err);
        }
        console.error(err);
    }
};

/**
 * 延迟执行函数
 * @param {Number} time 延迟时间
 */
const sleep = (time: number) => (
    new Promise((resolve) => {
        setTimeout(resolve, time);
    })
);

/**
 * 异步查询结果
 * @param {Function} func 异步查询的函数
 * @param {Object} funcParams 异步查询的函数参数
 * @param {Number} intervalTime 异步查询间隔，默认1000ms
 * @param {Number} maxTryCount 异步查询尝试次数，默认200
 */
export const getResAsync = async (func: Function, funcParams: any, intervalTime: number = 1000, maxTryCount: number = 200) => {
    let isEnd = false;
    let returnData;

    try {
        for (let i = 0; i < maxTryCount && !isEnd; i++) {
            let resData = await func(funcParams);
            //  ResData格式不确定
            const { State, TaskCode, TaskDesc, ...ResData } = resData.Data;
            if (State === 1) {
                //  任务在进行中
                message.loading('正在操作，请稍后...');
                //  等待1s
                await sleep(intervalTime);
            } else {
                //  任务已完成
                isEnd = true;
                if (TaskCode === 0) {
                    //  结束，数据返回正确
                    returnData = ResData;
                } else {
                    //  结束，操作失败
                    throw new Error(TaskDesc);
                }
            }
        }
    } catch (err) {
        throw new Error(err);
    }

    return returnData;
};
