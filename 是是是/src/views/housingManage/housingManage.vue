<template>
  <div id='HousingManage' class="housingManage">
    <el-row>
      <el-col :span="7">
        <el-col class="flex-box" :span="24">
          <el-col :span="16">
            <LabelTitle :title="'楼栋列表'"></LabelTitle>
          </el-col>
          <el-col style="text-align: right;" :span="10">
            <el-button @click="synchronizERP()" type="primary">同步ERP房源</el-button>
          </el-col>
        </el-col>
        <el-col :span="8" class="addBan" v-if="false">
          <el-button type="primary">增加楼栋</el-button>
        </el-col>
        <el-col :span="24">
          <ul class="ban">
            <li>项目名称：{{ projectNameActive }}</li>
            <li v-for="building in buildings" :key="building.buildingId" :class="building.active ? 'active' : ''">
              <span @click="roomBriefClick(building.buildingId, building)">{{ building.name }}</span>
              <div class="buttons">
                <el-button type="text" @click="editBuildingFun(building)">编辑</el-button>
                <el-button type="text" @click="deleteBuilding(building.buildingId)">删除</el-button>
              </div>
            </li>
          </ul>
        </el-col>
      </el-col>
      <el-col :span="16" :offset="1" class="housingListCol">
        <el-row>
          <el-col :span="13" class="housingListTopBut">
            <el-popover
              ref="popover5"
              placement="bottom"
              width="82"
              trigger="hover">
              <div style="text-align: right; margin: 0">
                <el-upload
                  class="upload-demo"
                  ref="upload"
                  :data="importHousingData"
                  :show-file-list="false"
                  action="/iCloud-rest/projects/roomBrief/upload/import"
                  accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  :before-upload='beforeAvatarUpload'
                  :on-success="handleSuccess">
                  <el-button size="mini" type="primary" style="width: 80px;margin-left: 0;margin-top: 10px;" @click='importRoom'>导入房间</el-button>
                </el-upload>
                <el-button type="primary" style="width: 80px;margin-left: 0;margin-top: 10px;" @click='roomBriefExport'>导出房间</el-button>
                <el-upload
                  class="upload-demo"
                  ref="upload"
                  :data="updateHousingData"
                  :show-file-list="false"
                  action="/iCloud-rest/projects/roomBrief/upload/update"
                  accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  :before-upload='beforeAvatarUpload'
                  :on-success="handleSuccess">
                  <el-button size="mini" type="primary" style="width: 80px;margin-left: 0;margin-top: 10px;" @click='importRoom'>更新房间</el-button>
                </el-upload>
                <el-button type="primary" style="width: 80px;margin-left: 0;margin-top: 10px;" @click='roomTemplateExport'>模版下载</el-button>
              </div>
            </el-popover>
            <el-popover
              ref="popover6"
              placement="bottom"
              width="82"
              trigger="hover">
              <div style="text-align: right; margin: 0">
                <el-upload
                  class="upload-demo"
                  ref="upload"
                  :data="importOwnerData"
                  :show-file-list="false"
                  action="/iCloud-rest/projects/roomBrief/upload/updateOwner"
                  accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  :before-upload='beforeAvatarUpload'
                  :on-success="handleOwnerSuccess">
                  <el-button size="mini" type="primary" style="width: 80px;margin-left: 0;margin-top: 10px;" @click='importOwner'>导入业主</el-button>
                </el-upload>
                <el-button type="primary" style="width: 80px;margin-left: 0;margin-top: 10px;" @click='roomBriefOwnerExport'>导出业主</el-button>
              </div>
            </el-popover>
            <el-button type="primary" @click="relationDoor" :disabled="!roomBriefParams.buildingId">关联户型</el-button>
            <el-button type="primary" v-popover:popover5>导入/导出/更新/模版</el-button>
            <el-button type="primary" v-popover:popover6>业主导入/导出</el-button>
          </el-col>
          <el-col :span="24" class="filterBox">
            <el-tabs v-model="activeName" type="card" class="myTabs" @tab-click="handleClick">
              <el-tab-pane label="列表模式" name="listModel">
                <el-col :span="12" class="colTop">
                  <el-col :span="5" class="title">房源状态：</el-col>
                  <el-col :span="6">
                    <el-select v-model="roomStatus" placeholder="全部" @change="roomStatusChange">
                      <el-option
                        v-for="item in roomStatusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="8" :offset="1">
                    <el-input v-model="searchRoomNumber" 
                              placeholder="房间号" 
                              @change="searchRoomNameChange" 
                              @keyup.enter.native="searchRoomName"
                              clearable></el-input>
                  </el-col>
                </el-col>
                <el-col :span="12" class="rightButton">
                  <el-button type="primary" @click="searchRoomName">搜索</el-button>
                  <el-button type="primary" @click="batchDelete">批量删除</el-button>
                </el-col>
                <el-col :span="24" class="housingList">
                  <el-table
                    :data="tableData"
                    :style="{borderColor: this.theme, width: '100%'}"
                    height="447"
                    stripe
                    @select="tableSelect"
                    @select-all="tableSelectAll">
                    <el-table-column
                      type="selection"
                      :disabled="roomPatternId"
                      width="30">
                    </el-table-column>
                    <el-table-column
                      label="序号"
                      align="center"
                      type="index"
                      width="50"
                      show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                      label="房间"
                      width='160'
                      align="center"
                      show-overflow-tooltip>
                      <template slot-scope="scope">
                        <span>
                          {{ scope.row.buildingName}} -
                          {{ scope.row.viewUnitNumber }} -
                          {{ scope.row.viewFloorNumber }} -
                          {{ scope.row.roomName }}
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="状态"
                      width='50'
                      align="center"
                      show-overflow-tooltip>
                      <template slot-scope="scope">
                        <span class="tableText" v-if='scope.row.roomStatus === 0'>待售</span>
                        <span class="tableText" v-else-if='scope.row.roomStatus === 1'>上架</span>
                        <span class="tableText" v-else-if='scope.row.roomStatus === 2'>认购</span>
                        <span class="tableText" v-else-if='scope.row.roomStatus === 3'>签约</span>
                        <span class="tableText" v-else-if='scope.row.roomStatus === 4'>初始</span>
                        <span class="tableText" v-else-if='scope.row.roomStatus === 5'>销控</span>
                        <span class="tableText" v-else-if='scope.row.roomStatus === 6'>预约</span>
                        <span class="tableText" v-else>草签</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="户型"
                      width='180'
                      align="center"
                      show-overflow-tooltip>
                      <template slot-scope="scope">
                        <span class="tableText">{{ scope.row.patternName }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="面积(㎡)"
                      align="center"
                      show-overflow-tooltip>
                      <template slot-scope="scope">
                        <span class="tableText"><i>建筑：</i>{{ scope.row.outArea }}</span>
                        <span class="tableText"><i>套内：</i>{{ scope.row.innerArea }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="单价(元)"
                      align="center"
                      show-overflow-tooltip>
                      <template slot-scope="scope">
                        <span class="tableText"><i>现建筑：</i>{{ scope.row.presentOutPrice | numberFormat }}</span>
                        <span class="tableText"><i>现套内：</i>{{ scope.row.presentInnerPrice | numberFormat }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="总价(元)"
                      align="center"
                      show-overflow-tooltip>
                      <template slot-scope="scope">
                        <span class="tableText">{{ scope.row.presentTotalPrice | numberFormat }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="操作"
                      align="center">
                      <template slot-scope="scope">
                        <el-button type="text" class="operation" @click="lookHousingFun(scope.row)">查看</el-button>
                        <el-button type="text" class="operation" v-if="scope.row.roomStatus === 0" @click="editHousingFun(scope.row)">编辑</el-button>
                        <el-button type="text" class="operation" @click="setHousingFun(scope.row)">{{!scope.row.isDiscount?'设为特价':'取消特价'}}</el-button>
                        <el-button type="text" class="operation" v-if="scope.row.roomStatus === 0" @click="roomBriefDelete(scope.row, scope.$index, tableData)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
                <el-col :span="24">
                  <div class="block">
                    <el-pagination
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page="currentPage"
                      :page-sizes="[10, 50, 100, 200]"
                      :page-size="pageSize"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="totalRecord">
                    </el-pagination>
                  </div>
                </el-col>
              </el-tab-pane>
              <el-tab-pane label="平铺模式" name="housingModel" :disabled='!buildingId'>
                <el-collapse :value="collapseActives">
                  <el-collapse-item title="筛选条件" name="filter">
                    <el-col :span="24" class="filter">
                      <span>单元：</span>
                      <el-tabs v-model="tileMode.units" type="card" @tab-click="unitHandleClick">
                        <el-tab-pane v-for="( item, index ) in unitData" :key="index" :label="item.name" :unitId="item.unitId" :name="index.toString()"></el-tab-pane>
                      </el-tabs>
                    </el-col>
                    <el-col :span="24" class="filter">
                      <span class="showInfo">显示信息：<br/><i :style="{color: theme}">*最多选3个</i></span>
                      <el-checkbox-group :min='1' :max='3' class="checkboxGroup" v-model="showInfo" size="small">
                        <el-checkbox-button v-for="info in dataShowInfo" :label="info" :key="info">{{info}}</el-checkbox-button>
                      </el-checkbox-group>
                    </el-col>
                  </el-collapse-item>
                </el-collapse>
                <el-row class="blockRow" v-if="isAssembleRoomBriefs">
                  <el-col :span="24" class="blockCol" v-for="( floor, index ) in assembleRoomBriefs" :key="index">
                    <span>{{ floor.floorNumber }}层</span>
                    <div style="float: left;width: 90%">
                      <div class="blockInfo" :style="{ background: theme }" v-for="( room, index ) in floor.rooms" :key="index">
                        <h3>{{ room.roomName }}</h3>
                        <p v-for="( info, index ) in showInfo" :key="index">
                          <i v-if="info === '原房源总价'">原总：{{ room.originalTotalPrice }}</i>
                          <i v-if="info === '现房源总价'">现总：{{ room.presentTotalPrice }}</i>
                          <i v-if="info === '原建筑单价'">原建单：{{ room.originalOutPrice }}</i>
                          <i v-if="info === '现建筑单价'">现建单：{{ room.presentOutPrice }}</i>
                          <i v-if="info === '建筑面积'">建面：{{ room.outArea }}</i>
                          <i v-if="info === '套内面积'">套面：{{ room.innerArea }}</i>
                          <i v-if="info === '原套内单价'">原单：{{ room.originalInnerPrice }}</i>
                          <i v-if="info === '现套内单价'">现单：{{ room.presentInnerPrice }}</i>
                          <i v-if="info === '装修总价'">装总：{{ room.totalDecorationPrice }}</i>
                        </p>
                        <div class="blockOperation">
                          <el-button type="text" @click="lookHousingFun(room)">查看</el-button>
                          <el-button type="text" v-if="room.roomStatus === 0" @click="editHousingFun(room)">编辑</el-button>
                          <el-button type="text" v-if="room.roomStatus === 0" @click="roomBriefDelete(room)">删除</el-button>
                        </div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
      </el-col>
      <el-dialog ref='dialog' :width="dialogWidth" :title="title" :visible.sync="dialogFormVisible" top="10vh" @close="dialogClose">
        <el-row v-if="lookHousing" class="lookHousing">
          <el-col :span="24" class="notImg" v-if="patternImages.length === 0">
            <img src="../../../static/images/notImg2.png" alt="暂无图片">
          </el-col>
          <el-col :span="24" v-else class="patternImages">
            <el-carousel>
              <el-carousel-item v-for="( item, index ) in patternImages" :key="index">
                <img :src="item.imageSrc" alt="">
              </el-carousel-item>
            </el-carousel>
          </el-col>
          <el-col :span="24" class="lookInfo">
            <el-col :span="22">
              房间：{{ lookHousingData.buildingName ? lookHousingData.buildingName : buildingName }}-{{ lookHousingData.viewUnitNumber }}-{{ lookHousingData.viewFloorNumber }}-{{ lookHousingData.roomName }}
            </el-col>
            <el-col :span="22">
              户型：{{lookHousingData.patternName}}
            </el-col>
            <el-col :span="14">
              <span v-if='lookHousingData.sourceType === 0'>类型：住宅</span>
              <span v-else-if='lookHousingData.sourceType === 1'>类型：公寓</span>
              <span v-else-if='lookHousingData.sourceType === 2'>类型：洋房</span>
              <span v-else-if='lookHousingData.sourceType === 3'>类型：别墅</span>
              <span v-else-if='lookHousingData.sourceType === 4'>类型：商铺</span>
              <span v-else-if='lookHousingData.sourceType === 5'>类型：办公</span>
              <span v-else-if='lookHousingData.sourceType === 6'>类型：车位</span>
              <span v-else-if='lookHousingData.sourceType === 7'>类型：产权车位</span>
              <span v-else-if='lookHousingData.sourceType === 8'>类型：人防车位</span>
              <span v-else>类型：储藏室</span>
            </el-col>
            <el-col :span="14">
              原房源总价：{{ lookHousingData.originalTotalPrice | numberFormat }}元
            </el-col>
            <el-col :span="10">
              现房源总价：{{ lookHousingData.presentTotalPrice | numberFormat }}元
            </el-col>
            <el-col :span="14">
              原建筑单价：{{ lookHousingData.originalOutPrice | numberFormat }}元
            </el-col>
            <el-col :span="10">
              现建筑单价：{{ lookHousingData.presentOutPrice | numberFormat }}元
            </el-col>
            <el-col :span="14">
              建筑面积：{{ lookHousingData.outArea }}㎡
            </el-col>
            <el-col :span="10">
              套内面积：{{ lookHousingData.innerArea }}㎡
            </el-col>
            <el-col :span="14">
              原套内单价：{{ lookHousingData.originalInnerPrice | numberFormat }}元
            </el-col>
            <el-col :span="10">
              现套内单价：{{ lookHousingData.presentInnerPrice | numberFormat }}元
            </el-col>
            <el-col :span="24">
              装修总价：{{ lookHousingData.totalDecorationPrice | numberFormat }}元
            </el-col>
          </el-col>
        </el-row>
        <el-row><el-col :span="24" v-if="introduce && selection.length === 0">
          <el-steps :active="active" align-center>
            <el-step title="选择户型"></el-step>
            <el-step title="关联户型"></el-step>
          </el-steps>
        </el-col></el-row>
        <el-row class="introduceHousing" v-if="active === 1 && introduce">
          <el-col :span="9" style="margin: 26px 20px;">
            <el-col :span="18">
              <el-input size="mini" v-model="searchDoor" placeholder="户型名称" @change="searchPatternChange" clearable></el-input>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" size="mini" @click="searchPattern">搜索</el-button>
            </el-col>
          </el-col>
          <el-col :span="24" class="building">
            <el-col :span="24" class="buildingBox">
              <div class="patternBox">
                <div class="pattern" v-for="pattern in roomPattern" :key="pattern.patternId">
                  <input type="radio" :id="pattern.patternId" name="patternRadio" @change="patternRadioChange(pattern.patternId)">
                  <label :for="pattern.patternId">
                    {{ pattern.roomPatternName }}-{{ pattern.name }}
                  </label>
                </div>
              </div>
            </el-col>
          </el-col>
        </el-row>
        <el-row class="introduceHousing" v-if="active === 2 && introduce">
          <el-col :span="24" style="margin: 26px 0;">
            <el-form :model="introduceHousingData">
              <el-col :span="6">
                <el-col :span="8" class="introduceLabel">楼栋：</el-col>
                <el-col :span="16">
                  <el-select v-model="introduceHousingData.building" placeholder="楼栋" size="mini" @change="buildingChange">
                    <el-option
                      v-for="item in buildings"
                      :key="item.buildingId"
                      :label="item.name"
                      :value="item.buildingId">
                    </el-option>
                  </el-select>
                </el-col>
              </el-col>
              <el-col :span="6">
                <el-col :span="8" class="introduceLabel">状态：</el-col>
                <el-col :span="16">
                  <el-select v-model="introduceHousingData.status" placeholder="全部" size="mini" @change="roomStatusChangeList">
                    <el-option
                      v-for="item in roomPatternStatusOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
              </el-col>
              <el-col :span="3" class="checkAll">
                <el-checkbox v-model="introduceHousingData.checkAll" @change="checkedWhole">全选</el-checkbox>
              </el-col>
              <el-col :span="9">
                <el-col :span="18">
                  <el-input size="mini" clearable v-model="introduceHousingData.roomName" placeholder="请输入房间号" @change="searchRoomNameChangeList"></el-input>
                </el-col>
                <el-col :span="6">
                  <el-button type="primary" size="mini" @click="searchRoomName">搜索</el-button>
                </el-col>
              </el-col>
            </el-form>
          </el-col>
          <el-col :span="24" class="building">
            <el-col :span="24" class="buildingBox">
              <div class="buildingName">{{ buildingName }}</div>
              <div class='scrollBox'>
                <el-row :gutter="10" class="unitBox">
                  <el-col :span="6" class="unit" v-for="( building, index ) in roomBriefs" :key="building.roomId">
                    <input type="checkbox" :id="building.roomId" :checked="introduceHousingData.checkAll" :disabled="building.roomPatternIdStatus === 1" ref="relationCheckbox" @change="relationChange(index)">
                    <el-tooltip placement="top" effect="light" :open-delay="800">
                      <div slot="content">面积：{{ building.outArea }}㎡<br/>总价：{{ building.outArea * building.presentOutPrice | numberFormat }}元</div>
                      <label :for="building.roomId">
                        {{ building.viewUnitNumber }}-{{ building.viewFloorNumber }}-{{ building.roomName }}
                      </label>
                    </el-tooltip>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-col>
        </el-row>
        <el-row v-if="editBuilding">
          <el-form :model="editBuildingForm" :rules='editBuildingFormRule' ref="editBuildingRuleForm">
            <el-row>
              <el-col :span="11">
                <el-form-item label="楼栋编号：" :label-width="formLabelWidth" prop='number'>
                  <el-input v-model="editBuildingForm.number" auto-complete="off" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="楼栋名称：" :label-width="formLabelWidth" prop='name'>
                  <el-input v-model="editBuildingForm.name" auto-complete="off" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="楼栋类型：" :label-width="formLabelWidth">
                  <el-select v-model="editBuildingForm.mode" placeholder="请选择楼栋类型" size="mini">
                      <el-option
                        v-for="item in buildingTypeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-row>
        <el-row v-if="editHousing">
          <el-form :model="editHousingForm" :rules='editHousingFormRule' ref="editHousingRuleForm">
            <el-row>
              <el-col :span="24">
                <el-col :span="11">
                  <el-form-item label="房间：" :label-width="formLabelWidth2">
                    <el-input v-model="editHousingForm.roomStructure" auto-complete="off" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="类型：" :label-width="formLabelWidth2">
                    <el-select v-model="editHousingForm.sourceType" placeholder="请选择" size="mini">
                      <el-option
                        v-for="item in roomTypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-col>
              <el-col :span="24">
                <el-col :span="11">
                  <el-form-item label="户型：" :label-width="formLabelWidth2">
                    <el-select v-model="editHousingForm.roomPatternId" placeholder="请选择" size="mini">
                      <el-option
                        v-for="item in roomPattern"
                        :key="item.patternId"
                        :label="item.name"
                        :value="item.patternId">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="房间号：" :label-width="formLabelWidth2" prop='roomName'>
                    <el-input v-model="editHousingForm.roomName" auto-complete="off" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-col>
              <el-col :span="24">
                <el-col :span="11">
                  <el-form-item label="原房源总价(元)：" :label-width="formLabelWidth2" prop='originalTotalPrice'>
                    <el-input v-model="editHousingForm.originalTotalPrice" auto-complete="off" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="现房源总价(元)：" :label-width="formLabelWidth2" prop='presentTotalPrice'>
                    <el-input v-model="editHousingForm.presentTotalPrice" auto-complete="off" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-col>
              <el-col :span="24">
                <el-col :span="11">
                  <el-form-item label="原建筑单价(元)：" :label-width="formLabelWidth2" prop='originalOutPrice'>
                    <el-input v-model="editHousingForm.originalOutPrice" auto-complete="off" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="现建筑单价(元)：" :label-width="formLabelWidth2" prop='presentOutPrice'>
                    <el-input v-model="editHousingForm.presentOutPrice" auto-complete="off" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-col>
              <el-col :span="24">
                <el-col :span="11">
                  <el-form-item label="建筑面积(㎡)：" :label-width="formLabelWidth2" prop='outArea'>
                    <el-input v-model="editHousingForm.outArea" auto-complete="off" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="套内面积(㎡)：" :label-width="formLabelWidth2" prop='innerArea'>
                    <el-input v-model="editHousingForm.innerArea" auto-complete="off" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-col>
              <el-col :span="24">
                <el-col :span="11">
                  <el-form-item label="原套内单价(元)：" :label-width="formLabelWidth2" prop='originalInnerPrice'>
                    <el-input v-model="editHousingForm.originalInnerPrice" auto-complete="off" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="现套内单价(元)：" :label-width="formLabelWidth2" prop='presentInnerPrice'>
                    <el-input v-model="editHousingForm.presentInnerPrice" auto-complete="off" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-col>
              <el-col :span="11">
                <el-form-item label="装修总价(元)：" :label-width="formLabelWidth2" prop='totalDecorationPrice'>
                  <el-input v-model="editHousingForm.totalDecorationPrice" auto-complete="off" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-row>
        <el-row v-if="selectBuilding">
          <el-col :span='24' class='selectBuildingCol'>
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkBuildingAll" @change="handleCheckAllChange">全选</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="checkedBuildings" @change="handleCheckedBuildingsChange">
              <el-checkbox
                v-for="building in buildings"
                :label="building.buildingId"
                :key="building.buildingId">
                {{building.name}}
              </el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-row>
        <div slot="footer" v-if="introduce || editBuilding || editHousing || selectBuilding" class="dialog-footer">
          <el-button class="dialog_foot_button" type="primary" v-if="active === 1 && !editBuilding && !editHousing && !selectBuilding && selection.length === 0" @click="next" :disabled="!patternId">下一步</el-button>
          <el-button class="dialog_foot_button" type="primary" v-if="active > 1 || editBuilding || editHousing || selectBuilding || selection.length > 0" @click="determine">确 定</el-button>
          <el-button class="dialog_foot_button" @click="dialogFormVisible = false">取 消</el-button>
        </div>
      </el-dialog>
    </el-row>
  </div>
</template>

<script>
  import Vue from 'vue'
  import LabelTitle from '../../components/LabelTitle'
  import * as oss from '../../common/js/ossBaseUrl'
  import { formatDate } from '../../common/js/date.js'
  import {
    requestExcelProcess,
    requestBuilding,
    requestRoomBrief,
    requestRoomBriefList,
    requestRoomBriefPut,
    requestRoomPatternList,
    setBuildingDelete,
    requestBuildingDelete,
    requestRoomBriefDelete,
    requestRoomBriefBatchDelete,
    requestRoomPatternImages,
    requestBuildingPut,
    requestBuildingUnit,
    requestRoomBriefExport,
    requestRoomBriefExportOwner,
    requestRoomBriefExportOwnerProcess,
    requestSynchronizERPGet,
    requestSynchronizERPProcessGet
  } from '../../store/fetch/api'
  import { lengthControl, validateNumber } from '../../common/js/formValidation'
  import {mapGetters} from 'vuex'

  export default {
    name: 'HousingManage',
    data () {
      return {
        selectRooms: [],
        companyId: '',
        roomStatus: '',
        title: '查看房源',
        lookHousing: false,
        introduce: false,
        editBuilding: false,
        editHousing: false,
        selectBuilding: false,
        isAssembleRoomBriefs: false,
        isOwnerExport: false,
        dialogFormVisible: false,
        introduceRoomBriefs: false,
        checkBuildingAll: false,
        isIndeterminate: false,
        dialogWidth: '500px',
        labelPosition: 'right',
        totalRecord: 1,
        currentPage: 1,
        pageSize: 1,
        totalPage: 1,
        formLabelWidth: '120px',
        formLabelWidth2: '160px',
        active: 1,
        activeName: 'listModel',
        tabsModel: 'listModel',
        searchRoomNumber: '',
        searchDoor: '',
        showInfo: ['原房源总价'],
        buildingId: '',
        checkedBuildings: [],
        tileMode: {
          units: '0'
        },
        collapseActives: [
          'filter'
        ],
        importHousingData: {
          projectId: '',
          tenantId: this.user.tenantId,
          companyId: '',
          userId: this.user.managerId
        },
        updateHousingData: {
          tenantId: this.user.tenantId,
          userId: this.user.managerId
        },
        importOwnerData: {
          tenantId: this.user.tenantId,
          projectId: sessionStorage.getItem('projectId')
        },
        tableData: [],
        introduceHousingData: {
          building: '',
          status: '',
          roomName: '',
          checkAll: false
        },
        editBuildingForm: { name: '', number: '', mode: '' },
        editBuildingFormRule: {
          name: [{ required: true, validator: lengthControl, trigger: 'blur' }],
          number: [{ required: true, validator: validateNumber }]
        },
        editHousingForm: {},
        editHousingFormRule: {
          roomName: [{ required: true, message: '房间号不能为空', trigger: 'blur' }],
          originalTotalPrice: [{ validator: validateNumber }],
          presentTotalPrice: [{ validator: validateNumber }],
          originalOutPrice: [{ validator: validateNumber }],
          presentOutPrice: [{ validator: validateNumber }],
          outArea: [{ validator: validateNumber }],
          innerArea: [{ validator: validateNumber }],
          originalInnerPrice: [{ validator: validateNumber }],
          presentInnerPrice: [{ validator: validateNumber }],
          totalDecorationPrice: [{ validator: validateNumber }]
        },
        roomStatusOptions: [
          { value: '', label: '全部' },
          { value: 0, label: '待售' },
          { value: 1, label: '上架' },
          { value: 2, label: '认购' },
          { value: 3, label: '签约' },
          { value: 4, label: '初始' },
          { value: 5, label: '销控' },
          { value: 6, label: '预约' },
          { value: 7, label: '草签' }
        ],
        roomPatternStatusOptions: [
          { value: '', label: '全部' },
          { value: 0, label: '未选' },
          { value: 1, label: '已选' }
        ],
        roomTypeOptions: [
          { value: 0, label: '住宅' },
          { value: 1, label: '公寓' },
          { value: 2, label: '洋房' },
          { value: 3, label: '别墅' },
          { value: 4, label: '商铺' },
          { value: 5, label: '办公' },
          { value: 6, label: '车位' },
          { value: 7, label: '产权车位' },
          { value: 8, label: '人防车位' },
          { value: 9, label: '储藏室' }
        ],
        buildingTypeList: [
          { label: '住宅', value: 0 },
          { label: '商铺', value: 1 },
          { label: '别墅', value: 2 },
          { label: '储藏室', value: 3 },
          { label: '车位', value: 4 },
          { label: '公寓', value: 5 },
          { label: '写字楼', value: 6 }
        ],
        dataShowInfo: ['原房源总价', '现房源总价', '原建筑单价', '现建筑单价', '建筑面积', '套内面积', '原套内单价', '现套内单价', '装修总价'],
        roomBriefParams: {
          projectId: sessionStorage.getItem('projectId'),
          tenantId: this.user.tenantId,
          buildingId: '',
          status: '',
          currentPage: 1,
          pageSize: 10
        },
        lookHousingData: [],
        patternId: '',
        unitId: '',
        patternImages: [],
        buildingName: '',
        buildings: [],
        unitData: [],
        roomBriefs: [],
        assembleRoomBriefs: [],
        roomPattern: [],
        selection: [],
        roomPatternId: ''
      }
    },
    props: ['user', 'projectNameActive'],
    components: {
      LabelTitle
    },
    computed: mapGetters({
      theme: 'GET_COLOUR'
    }),
    filters: {
      numberFormat (number, decimals, decPoint, thousandsSep) {
        number = (number + '').replace(/[^0-9+-Ee.]/g, '')
        let n = !isFinite(+number) ? 0 : +number
        let prec = !isFinite(+2) ? 0 : Math.abs(2)
        let sep = (typeof thousandsSep === 'undefined') ? ',' : '.'
        let dec = (typeof decPoint === 'undefined') ? '.' : ','
        let s = ''
        let toFixedFix = function (n, prec) {
          let k = Math.pow(10, prec)
          return '' + Math.ceil(n * k) / k
        }
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
        let re = /(-?\d+)(\d{3})/
        while (re.test(s[0])) {
          s[0] = s[0].replace(re, '$1' + sep + '$2')
        }

        if ((s[1] || '').length < prec) {
          s[1] = s[1] || ''
          s[1] += new Array(prec - s[1].length + 1).join('0')
        }
        return s.join(dec)
      }
    },
    created () {
      if (this.roomBriefParams.projectId) {
        this.getBuilding()
      }
    },
    methods: {
      // 获取楼栋
      async getBuilding () {
        const params = {
          projectId: sessionStorage.getItem('projectId'),
          tenantId: this.user.tenantId
        }
        const result = await requestBuilding(params)
        this.buildings = result.data.result
      },
      // 获取单元
      async getBuildingUnit (buildingId) {
        const params = {
          projectId: sessionStorage.getItem('projectId'),
          buildingId: buildingId
        }
        const result = await requestBuildingUnit(params)
        this.unitId = result.data.result.length ? result.data.result[0].unitId : ''
        this.unitData = result.data.result
        this.getRoomBriefAll(this.unitId, buildingId)
      },
      // 获取户型
      async getRoomPattern (name) {
        const params = {
          projectId: sessionStorage.getItem('projectId'),
          tenantId: this.user.tenantId,
          currentPage: 0,
          pageSize: 0,
          name: name
        }
        const result = await requestRoomPatternList(params)
        this.roomPattern = result.data.result
      },
      // 获取当前楼栋分页房源
      async getRoomBrief (buildingId) {
        this.roomBriefParams.buildingId = buildingId
        this.roomBriefParams.projectId = sessionStorage.getItem('projectId')
        this.$store.commit('UPDATE_LOADING_STATUS', {isLoading: true})
        if (this.roomBriefParams.projectId) {
          const result = await requestRoomBrief(this.roomBriefParams)
          if (result) {
            this.$store.commit('UPDATE_LOADING_STATUS', {isLoading: false})
            this.totalRecord = result.data.totalRecord
            this.currentPage = result.data.currentPage
            this.pageSize = result.data.pageSize
            this.totalPage = result.data.totalPage
            this.tableData = result.data.result
          }
        }
      },
      // 获取当前楼栋所有房源
      async getRoomBriefAll (unitId, buildingId, status, name) {
        this.roomBriefParams.buildingId = buildingId
        this.introduceHousingData.status = status
        const roomBriefParams = {
          projectId: sessionStorage.getItem('projectId'),
          tenantId: this.user.tenantId,
          buildingId: this.roomBriefParams.buildingId,
          unitId: unitId,
          currentPage: 0,
          pageSize: 0,
          status: status,
          name: name
        }
        if (roomBriefParams.projectId) {
          const result = await requestRoomBriefList(roomBriefParams)
          this.roomBriefs = result.data.result
          if (this.tabsModel !== 'listModel' && !this.introduce) {
            this.$store.commit('UPDATE_LOADING_STATUS', {isLoading: true})
            this.assembleRoomBriefs = [{
              floorNumber: '',
              rooms: []
            }]
            this.roomBriefs.forEach((roomBrief) => {
              let flag = false
              let index = 0
              for (let i = 0; i < this.assembleRoomBriefs.length; i++) {
                if (roomBrief.floorNumber === this.assembleRoomBriefs[i].floorNumber) {
                  flag = true
                  index = i
                }
              }
              if (flag) {
                this.assembleRoomBriefs[index].rooms.push(roomBrief)
              } else {
                this.assembleRoomBriefs.push({floorNumber: roomBrief.floorNumber, rooms: [roomBrief]})
              }
            })
            this.assembleRoomBriefs.splice(0, 1)
            this.assembleRoomBriefs.reverse()
            this.assembleRoomBriefs.forEach((briefs) => {
              briefs.rooms.reverse()
            })
            this.isAssembleRoomBriefs = true
            this.$store.commit('UPDATE_LOADING_STATUS', {isLoading: false})
          }
          this.roomBriefs.forEach((roomBrief) => {
            if (!roomBrief.roomPatternId) {
              roomBrief.roomPatternIdStatus = 0
            } else {
              roomBrief.roomPatternIdStatus = 1
            }
          })
        }
      },
      async roomBriefExport () {
        this.title = '选择楼栋'
        this.selectBuilding = true
        this.dialogWidth = '600px'
        this.dialogFormVisible = true
      },
      roomBriefOwnerExport () {
        this.title = '选择楼栋'
        this.selectBuilding = true
        this.dialogWidth = '600px'
        this.dialogFormVisible = true
        this.isOwnerExport = true
      },
      globalExport (result, templateName) {
        const content = result
        const blob = new Blob([content])
        const fileName = `${templateName}.xlsx`
        if ('download' in document.createElement('a')) { // 非IE下载
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else { // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
      },
      handleCheckAllChange (val) {
        let checkedBuildings = []
        if (val) {
          this.buildings.forEach((building) => {
            checkedBuildings.push(building.buildingId)
          })
        }
        this.checkedBuildings = checkedBuildings
        this.isIndeterminate = false
      },
      handleCheckedBuildingsChange (value) {
        let checkedCount = value.length
        this.checkBuildingAll = checkedCount === this.buildings.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.buildings.length
      },
      roomBriefClick (buildingId, building) {
        this.selection = []
        this.buildingId = buildingId
        if (building) {
          this.$nextTick(() => {
            this.buildingName = building.name
            this.buildings.forEach(function (building) {
              Vue.set(building, 'active', false)
            })
            Vue.set(building, 'active', true)
          })
        }
        if (this.tabsModel === 'listModel') {
          this.getRoomBrief(buildingId, building)
        } else {
          this.getBuildingUnit(buildingId)
          this.tileMode.units = '0'
        }
      },
      // 下一步
      next () {
        this.active++
        if (this.tabsModel === 'listModel') {
          this.getRoomBriefAll(null, this.roomBriefParams.buildingId)
        }
      },
      // dialog关闭
      dialogClose () {
        if (this.editBuilding) {
          this.$refs.editBuildingRuleForm.clearValidate()
        } else if (this.editHousing) {
          this.$refs.editHousingRuleForm.clearValidate()
        }
        this.lookHousing = false
        this.introduce = false
        this.editBuilding = false
        this.editHousing = false
        this.selectBuilding = false
        this.isIndeterminate = false
        this.isOwnerExport = false
        this.introduceRoomBriefs = false
        this.introduceHousingData.checkAll = false
        this.active = 1
        this.introduceHousingData.status = ''
        this.searchDoor = ''
        this.checkedBuildings = []
        this.editBuildingForm = {
          name: '',
          number: ''
        }
      },
      // 选择楼栋
      buildingChange (buildingId) {
        this.buildings.forEach((building) => {
          if (building.buildingId === buildingId) {
            this.buildingName = building.name
          }
        })
        this.roomBriefParams.buildingId = buildingId
        this.introduceHousingData.checkAll = false
        this.getRoomBriefAll(null, this.roomBriefParams.buildingId)
      },
      // 全选关联户型
      checkedWhole (checked) {
        if (checked) {
          this.roomBriefs.forEach((brief, index) => {
            if (!this.$refs.relationCheckbox[index].disabled) {
              brief.roomPatternId = this.patternId
            }
          })
        } else {
          this.roomBriefs.forEach((brief, index) => {
            if (!this.$refs.relationCheckbox[index].disabled) {
              brief.roomPatternId = null
            }
          })
        }
      },
      // 关联户型
      relationChange (index) {
        if (this.$refs.relationCheckbox[index].checked) {
          this.roomBriefs[index].roomPatternId = this.patternId
        } else {
          this.roomBriefs[index].roomPatternId = null
        }
      },
      patternRadioChange (patternId) {
        this.patternId = patternId
      },
      roomStatusChange () {
        this.roomBriefParams.status = this.roomStatus
        this.getRoomBrief(this.roomBriefParams.buildingId)
      },
      roomStatusChangeList () {
        this.introduceHousingData.checkAll = false
        if (this.introduceHousingData.status === '') {
          this.$refs.relationCheckbox.forEach((dom) => {
            dom.parentNode.style.display = 'block'
          })
        } else if (this.introduceHousingData.status === 0) {
          this.$refs.relationCheckbox.forEach((dom) => {
            if (dom.disabled) {
              dom.parentNode.style.display = 'none'
            } else {
              dom.parentNode.style.display = 'block'
            }
          })
        } else {
          this.$refs.relationCheckbox.forEach((dom) => {
            if (dom.disabled) {
              dom.parentNode.style.display = 'block'
            } else {
              dom.parentNode.style.display = 'none'
            }
          })
        }
      },
      relationDoor () {
        this.title = '关联户型'
        this.introduce = true
        this.dialogWidth = '800px'
        this.dialogFormVisible = true
        this.introduceHousingData.building = this.roomBriefParams.buildingId
        this.getRoomPattern()
      },
      searchRoomNameChange () {
        if (!this.searchRoomNumber) {
          this.roomBriefParams.name = ''
          this.getRoomBrief(this.roomBriefParams.buildingId)
        }
      },
      searchRoomNameChangeList () {
        if (!this.introduceHousingData.roomName) {
          this.getRoomBriefAll(null, this.roomBriefParams.buildingId, null, null)
        }
      },
      searchPatternChange () {
        if (!this.searchDoor) {
          this.getRoomPattern(null)
        }
      },
      searchPattern () {
        this.getRoomPattern(this.searchDoor)
      },
      searchRoomName () {
        if (this.searchRoomNumber) {
          this.roomBriefParams.name = this.searchRoomNumber
          this.getRoomBrief(this.roomBriefParams.buildingId)
        } else if (this.introduceHousingData.roomName) {
          this.getRoomBriefAll(null, this.roomBriefParams.buildingId, null, this.introduceHousingData.roomName)
        }
      },
      tableSelect (selection, row) {
        this.selection = []
        selection.forEach((select, index) => {
          this.selection[index] = select.roomId
          this.selectRooms[index] = select
        })
      },
      tableSelectAll (selection) {
        this.selection = []
        selection.forEach((select, index) => {
          this.selection[index] = select.roomId
          this.selectRooms[index] = select
        })
      },
      async lookHousingFun (rows) {
        if (rows.roomPatternId) {
          const result = await requestRoomPatternImages({ patternId: rows.roomPatternId })
          this.patternImages = result.data
          this.patternImages.forEach((patternImage) => {
            patternImage.imageSrc = oss.OSS_BASE_URL + patternImage.imageSrc
          })
        } else {
          this.patternImages = []
        }
        this.title = '查看房源'
        this.dialogWidth = '500px'
        this.lookHousing = true
        this.lookHousingData = rows
        this.dialogFormVisible = true
      },
      async batchDelete () {
        if (this.selection.length) {
          this.$confirm('此操作将永久删除所有选中房源, 是否继续?', '提示', {
            cancelButtonText: '取消',
            confirmButtonText: '确定',
            type: 'warning',
            center: true
          }).then(async () => {
            await requestRoomBriefBatchDelete({ roomIds: this.selection.toString() })
            this.getRoomBrief(this.roomBriefParams.buildingId)
            this.$message({ type: 'success', message: '批量删除成功' })
          }).catch(() => {})
        } else {
          this.$message.info('请选择需要删除的房源')
        }
      },
      roomBriefDelete (rows, index, data) {
        this.$confirm('此操作将永久删除该房源, 是否继续?', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning',
          center: true
        }).then(async () => {
          await requestRoomBriefDelete(rows.roomId)
          if (index) {
            data.splice(index, 1)
          } else {
            this.getRoomBriefAll(this.unitId, this.roomBriefParams.buildingId)
          }
          this.$message({ type: 'success', message: '删除房源成功' })
        }).catch(() => {})
      },
      editBuildingFun (building) {
        this.editBuildingForm = {
          name: building.name,
          number: building.number,
          mode: building.mode,
          buildingId: building.buildingId,
          companyId: building.companyId,
          tenantId: building.tenantId,
          projectId: building.projectId
        }
        this.title = '编辑楼栋'
        this.dialogFormVisible = true
        this.editBuilding = true
        this.dialogWidth = '800px'
      },
      editHousingFun (building) {
        let buildingName = building.buildingName ? building.buildingName : this.buildingName
        this.title = '编辑房源'
        this.editHousing = true
        this.dialogFormVisible = true
        this.dialogWidth = '800px'
        building.roomStructure = `${buildingName}-${building.viewUnitNumber}-${building.floorNumber}-${building.roomName}`
        this.editHousingForm = building
        this.getRoomPattern()
      },
      async setHousingFun(obj = {}){
        let queryData ={
          "roomIds": [obj.roomId],
          "isDiscount": +!obj.isDiscount
        }
        await setBuildingDelete(queryData)
        this.getRoomBrief(this.roomBriefParams.buildingId)
        this.$message({ type: 'success', message: obj.isDiscount?'取消成功':'设置成功' })
      },
      deleteBuilding (buildingId) {
        this.$confirm('此操作将永久删除该楼栋, 是否继续?', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning',
          center: true
        }).then(async () => {
          await requestBuildingDelete({buildingId: buildingId}, buildingId)
          this.getBuilding()
          this.$message({ type: 'success', message: '删除楼栋成功' })
        }).catch(() => {})
      },
      async determine () {
        if (this.introduce) {
          if (this.selection.length) {
            let selectRooms = []
            for (let i = 0; i < this.selectRooms.length; i++) {
              console.log(this.selectRooms[i])
              selectRooms[i] = JSON.parse(JSON.stringify(this.selectRooms[i]))
              selectRooms[i]['roomPatternId'] = this.patternId
              delete selectRooms[i]['imageUri']
              delete selectRooms[i]['buildingName']
              delete selectRooms[i]['patternName']
              delete selectRooms[i]['roomPatternIdStatus']
              delete selectRooms[i]['number']
            }
            setTimeout(async() => {
              await requestRoomBriefPut(selectRooms)
              this.dialogFormVisible = false
              this.getRoomBrief(this.roomBriefParams.buildingId)
              this.$message({
                message: '关联户型成功',
                type: 'success'
              })
            }, 30)
            this.selectRooms = []
            this.selection = []
          } else {
            for (let i = 0; i < this.$refs.relationCheckbox.length; i++) {
              if (this.$refs.relationCheckbox[i].checked && !this.$refs.relationCheckbox[i].disabled) {
                this.introduceRoomBriefs = true
              }
            }
            if (this.introduceRoomBriefs) {
              for (let i = 0; i < this.roomBriefs.length; i++) {
                delete this.roomBriefs[i].patternName
                delete this.roomBriefs[i].roomPatternIdStatus
              }
              setTimeout(async() => {
                await requestRoomBriefPut(this.roomBriefs)
                this.dialogFormVisible = false
                this.getRoomBrief(this.roomBriefParams.buildingId)
                this.$message({
                  message: '关联户型成功',
                  type: 'success'
                })
              }, 0)
            } else {
              this.$message.info('暂无可关联房源')
            }
          }
        } else if (this.editBuilding) {
          this.$refs.editBuildingRuleForm.validate(async(valid) => {
            if (valid) {
              await requestBuildingPut(this.editBuildingForm)
              this.getBuilding()
              this.dialogFormVisible = false
              this.$message({
                message: '修改成功',
                type: 'success'
              })
            } else {
              return false
            }
          })
        } else if (this.editHousing) {
          this.$refs.editHousingRuleForm.validate(async(valid) => {
            if (valid) {
              delete this.editHousingForm.roomStructure
              delete this.editHousingForm.roomPatternIdStatus
              delete this.editHousingForm.buildingName
              delete this.editHousingForm.patternName
              delete this.editHousingForm.number
              delete this.editHousingForm.imageUri
              await requestRoomBriefPut([this.editHousingForm])
              this.getRoomBrief(this.roomBriefParams.buildingId)
              this.dialogFormVisible = false
              this.$message({
                message: '修改成功',
                type: 'success'
              })
            } else {
              return false
            }
          })
        } else if (this.selectBuilding) {
          if (this.checkedBuildings.length) {
            const params = {
              tenantId: this.user.tenantId,
              projectId: sessionStorage.getItem('projectId'),
              currentPage: 0,
              pageSize: 0,
              buildingIds: this.checkedBuildings.toString()
            }
            const date = new Date()
            const currentTime = formatDate(date, 'yyyyMMdd_hhmmss')
            if (this.isOwnerExport) {
              const result = await requestRoomBriefExportOwner(params)
              this.globalExport(result, `${this.projectNameActive}_业主列表_${currentTime}`)
              this.dialogFormVisible = false
              this.$message.success('导出业主列表成功')
            } else {
              const result = await requestRoomBriefExport(params)
              this.globalExport(result, `${this.projectNameActive}_房间列表_${currentTime}`)
              this.dialogFormVisible = false
              this.$message.success('导出房间列表成功')
            }
          } else {
            this.$message.info('请选择您所要导出的楼栋。')
          }
        }
      },
      importRoom () {
        this.importHousingData.companyId = sessionStorage.getItem('companyId')
        this.importHousingData.projectId = sessionStorage.getItem('projectId')
      },
      importOwner () {
        this.importOwnerData.projectId = sessionStorage.getItem('projectId')
      },
      beforeAvatarUpload (file) {
        if (this.importHousingData.projectId || this.importOwnerData.projectId) {
          let Xls = file.name.split('.')
          if (Xls[Xls.length - 1] === 'xls' || Xls[Xls.length - 1] === 'xlsx') {
            return file
          } else {
            this.$message.error('导入文件只能是 xls/xlsx 格式')
            return false
          }
        } else {
          this.$message.info('请选择一个项目')
          return false
        }
      },
      handleSuccess (res, file, fileList) {
        if (res.status === 200) {
          const params = {
            redisKey: res.data
          }
          this.$message({
            message: res.message.describeCn,
            duration: '1000',
            type: 'info'
          })
          this.timerId = setInterval(async() => {
            const result = await requestExcelProcess(params)
            const progress = { isShowProgress: true, percentage: result.data.process, info: result.data.message }
            this.$store.commit('UPDATE_PROGRESS', progress)
            if (result.data.status === 1) {
              clearInterval(this.timerId)
              if (result.data.success === 1) {
                this.getBuilding()
                if (this.roomBriefParams.buildingId) {
                  this.getRoomBrief(this.roomBriefParams.buildingId)
                }
                this.$message({
                  message: result.data.message,
                  type: 'success'
                })
              } else {
                this.$message({
                  message: result.data.message,
                  type: 'error'
                })
                if (result.data.excelUrl) {
                  window.location.href = '/iCloud-rest/projects' + result.data.excelUrl
                }
              }
              const state = { isShowProgress: false, percentage: 0, info: '' }
              this.$store.commit('UPDATE_PROGRESS', state)
            }
          }, 1000)
        } else {
          this.$message({
            message: res.message.message,
            type: 'error'
          })
        }
      },
      handleOwnerSuccess (res, file, fileList) {
        if (res.status === 200) {
          this.$message({
            message: res.message.describeCn,
            duration: '1000',
            type: 'info'
          })
          this.timerId = setInterval(async() => {
            const result = await requestRoomBriefExportOwnerProcess(res.data)
            if (result.data.status === 1) {
              clearInterval(this.timerId)
              if (result.data.success === 1) {
                this.$message({
                  message: result.data.message,
                  type: 'success'
                })
              } else {
                this.$message({
                  message: result.data.message,
                  type: 'error'
                })
                if (result.data.excelUrl) {
                  window.location.href = result.data.excelUrl
                }
              }
            }
          }, 1000)
        } else {
          this.$message({
            message: res.message.message,
            type: 'error'
          })
        }
      },
      handleClick (tab) {
        this.tabsModel = tab.name
        if (tab.name === 'housingModel') {
          this.getBuildingUnit(this.roomBriefParams.buildingId)
        } else {
          this.getRoomBrief(this.roomBriefParams.buildingId)
        }
      },
      unitHandleClick (tab) {
        this.unitId = tab.$attrs.unitId
        this.getRoomBriefAll(this.unitId, this.roomBriefParams.buildingId)
      },
      handleSizeChange (val) {
        this.selection = []
        this.roomBriefParams.pageSize = val
        this.getRoomBrief(this.roomBriefParams.buildingId)
      },
      handleCurrentChange (val) {
        this.selection = []
        this.roomBriefParams.currentPage = val
        this.getRoomBrief(this.roomBriefParams.buildingId)
      },
      downloadByIframe (url) {
        let iframe = document.getElementById('myIframe')
        if (iframe) {
          iframe.src = url
        } else {
          iframe = document.createElement('iframe')
          iframe.style.display = 'none'
          iframe.src = url
          iframe.id = 'myIframe'
          document.body.appendChild(iframe)
        }
      },
      roomTemplateExport () {
        this.downloadByIframe('./static/excelTemplate/房源导入模板.xlsx')
      },
      async synchronizERP () {
        let param = sessionStorage.getItem('projectId')
        await requestSynchronizERPGet(param)
        this.$message({
          message: '开始同步ERP数据!',
          duration: '1000',
          type: 'info'
        })
        this.timerId = setInterval(async() => {
          const result = await requestSynchronizERPProcessGet(param)
          const progress = { isShowProgress: true, percentage: result.data.process, info: '开始同步 ERP 数据！' }
          this.$store.commit('UPDATE_PROGRESS', progress)
          if (result.data.status === '1') {
            clearInterval(this.timerId)
            this.$message({
              message: '同步完成',
              type: 'success'
            })
            const state = { isShowProgress: false, percentage: 0, info: '' }
            this.$store.commit('UPDATE_PROGRESS', state)
            this.getBuilding()
          } else if (result.data.status === '-1') {
            clearInterval(this.timerId)
            this.$message({
              message: '同步失败！',
              type: 'error'
            })
            const state = { isShowProgress: false, percentage: 0, info: '' }
            this.$store.commit('UPDATE_PROGRESS', state)
          }
        }, 1000)
      }
    }
  }
</script>

<style scoped lang="scss">
  .housingManage{
    .addBan{
      line-height: 52px;
      text-align: right;
    }
    .title{
      line-height: 30px;
    }
    .ban{
      border: 1px solid #eee;
      height: 510px;
      overflow-y: scroll;
      li{
        line-height: 40px;
        border-bottom: 1px solid #eee;
        padding: 0 24px;
        display: flex;
        &:first-child{
          padding-left: 16px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        &:last-child{
          border: none;
        }
        &:not(:first-child) {
          cursor:pointer;
        }
        span{
          width: 60%;
          display: inline-block;
        }
        .buttons {
          width: 40%;
          text-align: right;
          display: inline-block;
        }
      }
      .active{
        background: #EAF7FF;
      }
    }
    .housingListCol{
      margin-top: 10px;
      .housingListTopBut{
        position: absolute;
        right: 0;
        top: 0;
        text-align: right;
        z-index: 99;
      }
      .colTop{
        margin-top: 20px;
      }
    }
    .notImg{
      width: 100%;
      box-sizing: border-box;
      padding: 0 0 20px 20px;
      img{
        width: 100%;
        display: block;
      }
    }
    .patternImages{
      padding: 0 0 20px 20px;
    }
    .introduceHousing{
      text-align: right;
      .introduceLabel{
        line-height: 30px;
      }
      .checkAll{
        line-height: 30px;
        text-align: center;
      }
      .building{
        padding-left: 20px;
        .buildingBox{
          border: 1px solid #EEEEEE;
          .scrollBox{
            height: 260px;
            overflow-y: scroll;
          }
        }
        .buildingName{
          height: 30px;
          background: #F7F7F7;
          text-align: left;
          line-height: 30px;
          text-indent: 20px;
        }
        .unitBox{
          padding: 10px 18px;
          text-align: left;
        }
        .patternBox{
          height: 260px;
          overflow-y: scroll;
          padding: 10px 18px;
          text-align: left;
        }
        .unit, .pattern{
          text-align: center;
          position: relative;
          height: 30px;
          margin: 6px 0 6px 0;
          display: inline-block;
          input{
            width: 100%;
            height: 100%;
            top:0;
            left: 0;
            position: absolute;
            visibility: hidden;
            &:checked{
              &+label{
                background: #0F8BE6;
                color: #fff;
              }
            }
            &:disabled{
              &+label{
                background: #60B974;
                color: #fff;
              }
            }
          }
          label{
            height: 100%;
            line-height: 30px;
            display: block;
            background: #EEEEEE;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            padding: 0 10px;
            &:hover{
              cursor:pointer;
            }
          }
        }
        .pattern{
          margin-right: 10px;
        }
      }
    }
    .lookInfo{
      height: auto;
      padding-left: 20px;
    }
    .selectBuildingCol{
      padding-left: 20px;
      .el-checkbox{
        margin-left: 0 !important;
        margin-right: 30px;
        margin-top: 5px;
      }
    }
    .blockRow{
      border: 1px solid #F2F2F2;
      padding: 16px 0 16px 44px;
      margin-bottom: 30px;
      .blockCol{
        span{
          width: 40px;
          float: left;
          line-height: 80px;
          margin-right: 10px;
        }
        .blockInfo{
          font-size: 12px;
          width: 120px;
          height: 80px;
          background: #EAF7FF;
          float: left;
          text-align: center;
          margin: 0 2px 2px 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          overflow: hidden;
          opacity: .7;
          color: #fff;
          i{
            font-style: normal;
          }
          &:hover{
            >.blockOperation{
              top: 0;
              transition: top .2s;
            }
          }
          .blockOperation{
            width: 100%;
            height: 100%;
            border: 1px solid #4AA7EC;
            background: #F7F7F7;
            box-sizing: border-box;
            position: absolute;
            top:-80px;
            left: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .el-button{
              margin: 0;
            }
          }
        }
      }
    }
    .checkboxGroup{
      margin-left: 70px;
      margin-bottom: 20px;
    }
    .housingList{
      margin-top: 10px;
    }
    .filter{
      position: relative;
      .el-tabs{
        margin-left: 70px;
      }
      span{
        width: 66px;
        text-align: right;
        position: absolute;
        line-height: 32px;
      }
    }
    .operation{
      width: 50px;
      text-align: left;
      text-indent: 1em;
      display: block;
      margin: 0 auto;
    }
    .tableText{
      display: block;
      width: 100%;
      min-height: 22px;
      position: relative;
      i{
        display: inline-block;
        width: 40px;
        text-align: right;
        font-style: normal;
      }
    }
    .leftButton{
      padding-left: 10px;
    }
    .rightButton{
      text-align: right;
      margin-top: 20px;
    }
    .showInfo{
      i{
        font-style: normal;
        font-size: 12px;
        color: #0F8BE6;
        position: absolute;
        left: 0;
        top: 20px;
      }
    }
    .block{
      text-align: right;
      margin: 20px 0;
    }
    .flex-box {
      display: flex;
      align-items: center;
    }
  }
</style>
