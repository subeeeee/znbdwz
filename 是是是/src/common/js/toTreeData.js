export function toTreeData (data, attributes) {
  let resData = data
  let tree = []

  for (let i = 0; i < resData.length; i++) {
    if (resData[i].type === attributes.type) {
      let obj = {
        id: resData[i][attributes.id],
        companyId: resData[i][attributes.companyId],
        title: resData[i][attributes.name],
        type: resData[i].type,
        tenantId: resData[i].tenantId,
        parentId: resData[i].parentId,
        lastModifyUserId: resData[i].lastModifyUserId,
        fullName: resData[i].fullName,
        referred: resData[i].referred,
        number: resData[i].number,
        area: resData[i].area,
        address: resData[i].address,
        status: resData[i].status,
        children: [],
        outerCompanyGuid: resData[i].outerCompanyGuid,
        outerCompanyId: resData[i].outerCompanyId
      }
      // debugger
      tree.push(obj)
      resData.splice(i, 1)
      i--
    }
  }
  run(tree)

  function run (chiArr) {
    if (resData.length !== 0) {
      for (let i = 0; i < chiArr.length; i++) {
        for (let j = 0; j < resData.length; j++) {
          if (chiArr[i].companyId === resData[j][attributes.parentId]) {
            let obj = {
              id: resData[j][attributes.id],
              companyId: resData[j][attributes.companyId],
              title: resData[j][attributes.name],
              type: resData[j].type,
              tenantId: resData[j].tenantId,
              parentId: resData[j].parentId,
              lastModifyUserId: resData[j].lastModifyUserId,
              fullName: resData[j].fullName,
              referred: resData[j].referred,
              number: resData[j].number,
              area: resData[j].area,
              address: resData[j].address,
              status: resData[j].status,
              children: [],
              outerCompanyGuid: resData[j].outerCompanyGuid || '',
              outerCompanyId: resData[j].outerCompanyId || ''
            }
            chiArr[i].children.push(obj)
            resData.splice(j, 1)
            j--
          }
        }
        run(chiArr[i].children)
      }
    }
  }
  return tree
}
