<template>
  <div id="AddProject"
       class="addProject">
    <el-tabs v-model="activeName"
             type="card"
             class="myTabs">
      <el-tab-pane label="基础信息"
                   name="first">
        <el-row style="position: relative">
          <el-col :span="24"
                  class="firstTitle">
            <span>公司：{{ companyName }}</span>
            <!-- <el-button type="primary"
                       @click.native="preservation('basicInfoRuleForm')">保 存</el-button> -->
          </el-col>
          <el-col :span="24"
                  class="basicInfoForm">
            <el-form :model="basicInfoForm"
                     :rules="basicInfoFormRules"
                     ref="basicInfoRuleForm">
              <el-row>
                <el-col :span="24">
                  <div class="title_info">基本信息</div>
                </el-col>
                <el-col :span="24">
                  <el-col :span="8">
                    <el-form-item label="项目名称："
                                  :label-width="formLabelWidth"
                                  prop='name'>
                      <el-input v-model="basicInfoForm.name"
                                auto-complete="off"
                                clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="项目简称："
                                  :label-width="formLabelWidth"
                                  prop='referred'>
                      <el-input v-model="basicInfoForm.referred"
                                auto-complete="off"
                                clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="所属公司："
                                  :label-width="formLabelWidth"
                                  prop='companyId'>
                      <el-tooltip placement="top">
                        <div slot="content">{{companyName}}</div>
                        <el-select disabled
                                   v-model="basicInfoForm.companyId">
                          <el-option v-for="item in organizationList"
                                     :key="item.companyId"
                                     :label="item.referred"
                                     :value="item.companyId"
                                     :disabled="item.disabled">
                          </el-option>
                        </el-select>
                      </el-tooltip>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="项目城市："
                                  :label-width="formLabelWidth" prop='city'>
                      <area-cascader v-if='areaCascader'
                                     :level="1"
                                     size="small"
                                     :data='pcaa'
                                     type="all"
                                     placeholder="请选择地区"
                                     v-model='basicInfoForm.city'></area-cascader>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="项目电话："
                                  :label-width="formLabelWidth"
                                  prop='telephone'>
                      <el-input v-model="basicInfoForm.telephone"
                                type="tel"
                                maxlength="13"
                                auto-complete="off"
                                clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="项目地址："
                                  :label-width="formLabelWidth">
                      <el-input v-model="basicInfoForm.address"
                                auto-complete="off"
                                clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="项目类型："
                                  :label-width="formLabelWidth">
                      <el-select v-model="basicInfoForm.projectType">
                        <el-option v-for="item in projectTypeList"
                                   :key="item.type"
                                   :label="item.value"
                                   :value="item.type">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="产权年限："
                                  :label-width="formLabelWidth"
                                  prop='propertyRight'>
                      <el-input v-model="basicInfoForm.propertyRight"
                                auto-complete="off"
                                clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="装修类型："
                                  :label-width="formLabelWidth">
                      <el-select v-model="basicInfoForm.decorateType">
                        <el-option v-for="item in decorateTypeList"
                                   :key="item.type"
                                   :label="item.value"
                                   :value="item.type">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="交房日期："
                                  :label-width="formLabelWidth">
                      <el-date-picker v-model="basicInfoForm.deliveryTime"
                                      type="date"
                                      value-format="yyyy-MM-dd HH:mm:ss"
                                      clearable
                                      placeholder="交房日期">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="最新开盘："
                                  :label-width="formLabelWidth">
                      <el-date-picker v-model="basicInfoForm.lastOpenTime"
                                      type="date"
                                      value-format="yyyy-MM-dd HH:mm:ss"
                                      clearable
                                      placeholder="最新开盘时间">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="预计开盘："
                                  :label-width="formLabelWidth">
                      <el-date-picker v-model="basicInfoForm.openTime"
                                      type="date"
                                      value-format="yyyy-MM-dd HH:mm:ss"
                                      clearable
                                      placeholder="预计开盘时间">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="最大面积："
                                  :label-width="formLabelWidth"
                                  prop='maxArea'>
                      <el-input v-model="basicInfoForm.maxArea"
                                auto-complete="off"
                                clearable>
                        <template slot="append">㎡</template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="最小面积："
                                  :label-width="formLabelWidth"
                                  prop='minArea'>
                      <el-input v-model="basicInfoForm.minArea"
                                auto-complete="off"
                                clearable>
                        <template slot="append">㎡</template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="开发商："
                                  :label-width="formLabelWidth"
                                  prop='developers'>
                      <el-input v-model="basicInfoForm.developers"
                                auto-complete="off"
                                clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="售卖状态："
                                  :label-width="formLabelWidth">
                      <el-select v-model="basicInfoForm.status">
                        <el-option v-for="item in projectStatusList"
                                   :key="item.type"
                                   :label="item.value"
                                   :value="item.type">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="楼盘均价："
                                  :label-width="formLabelWidth"
                                  prop='averagePrice'>
                      <el-input v-model="basicInfoForm.averagePrice"
                                auto-complete="off"
                                clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="均价："
                                  prop='avgPrice'
                                  :label-width="formLabelWidth">
                      <el-input v-model="basicInfoForm.avgPrice"
                                auto-complete="off"
                                clearable>
                        <template slot="append">元/㎡</template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="售楼地址："
                                  :label-width="formLabelWidth">
                      <el-input v-model="basicInfoForm.showroomAddress"
                                auto-complete="off"
                                clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24" class="sellPoint">
                    <el-form-item label="卖点标签："
                                  :label-width="formLabelWidth">
                      <!-- <el-tag
                        :key="tag"
                        v-for="tag in dynamicTags"
                        closable
                        size="medium"
                        :disable-transitions="false"
                        @close="handleTagsClose(tag)">
                        {{tag}}
                      </el-tag>
                      <el-input
                        class="input-new-tag"
                        v-if="inputTagsVisible"
                        v-model="inputTagsValue"
                        ref="saveTagInput"
                        @keyup.enter.native="handleInputConfirm"
                        @blur="handleInputConfirm"
                      >
                      </el-input>
                      <el-button v-else class="button-new-tag" size="mini" type="primary" @click="showTagsInput">+ 添加</el-button> -->
                      <el-input v-model="basicInfoForm.sellPoint"
                                auto-complete="off"
                                clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="推荐文本："
                                  :label-width="formLabelWidth">
                      <el-input v-model="basicInfoForm.recommendActivity"
                                type="textarea"
                                :rows="2"
                                maxlength="1024"
                                placeholder="请输入推荐文本内容"
                                auto-complete="off"
                                clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="周边配套："
                                  :label-width="formLabelWidth">
                      <el-input v-model="basicInfoForm.surroundFacility"
                                type="textarea"
                                maxlength="2048"
                                :rows="2"
                                placeholder="请输入周边配套内容"
                                auto-complete="off"
                                clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="22" v-if="userType === 0">
                    <el-form-item label="是否限购："
                                  prop='isLimit'
                                  :label-width="formLabelWidth">
                        <el-radio-group v-model="basicInfoForm.isLimit">
                          <el-radio :label="0">否</el-radio>
                          <el-radio :label="1">是</el-radio>
                        </el-radio-group>
                        <el-tooltip placement="top">
                          <div slot="content">配置为“否”表示该项目所有楼盘均为不限购，将在不限购专区展示</div>
                          <i class="doubt el-icon-question"></i>
                        </el-tooltip>
                    </el-form-item>
                  </el-col>
                  <el-col :span="22" v-if="userType === 0">
                    <el-form-item label="是否设置推荐："
                                  prop='promoteSort'
                                  :label-width="formLabelWidth">
                      <el-col :span="5">
                        <el-radio-group v-model="basicInfoForm.promoteSortRadio" @change="promoteSortRadioChange">
                          <el-radio :label="0">否</el-radio>
                          <el-radio :label="1">是</el-radio>
                        </el-radio-group>
                      </el-col>
                      <el-col :span="5" v-if="basicInfoForm.promoteSortRadio===1">
                        <el-select v-model="basicInfoForm.promoteSort">
                          <el-option v-for="item in promoteSortList"
                             :key="item"
                             :label="item"
                             :value="item">
                          </el-option>
                        </el-select>
                        <!-- <el-input v-model="basicInfoForm.promoteSort" type="number" maxlength="5" auto-complete="off" clearable></el-input> -->
                      </el-col>
                    </el-form-item>
                  </el-col>
                </el-col>
                <el-col :span="24">
                  <div class="title_info">配套信息</div>
                </el-col>
                <el-col :span="24">
                  <el-col :span="8">
                    <el-form-item label="经度："
                                  :label-width="formLabelWidth">
                      <el-input v-model="basicInfoForm.latitude"
                                auto-complete="off"
                                clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="纬度："
                                  :label-width="formLabelWidth">
                      <el-input v-model="basicInfoForm.longitude"
                                auto-complete="off"
                                clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <div class="info_block">
                      <div class="top">
                        系统定义配套信息
                        <el-tooltip placement="right">
                          <div slot="content">系统将根据您填写的经纬度信息进行展示相关配套信息</div>
                          <i class="el-icon-question" style="color: #ccc"></i>
                        </el-tooltip>
                        <el-switch
                          v-model="basicInfoForm.systemFacilityStatus"
                            :active-value="1"
                            :inactive-value="0">
                        </el-switch>
                      </div>
                      <div class="bottom">
                        <el-form-item label="配套类型："
                                      :label-width="formLabelWidth">
                          <el-checkbox-group v-model="basicInfoForm.systemFacilityList">
                            <el-checkbox v-for="item in checkLists" :label="item.value" :key="item.value" :disabled="!basicInfoForm.systemFacilityStatus">{{item.label}}</el-checkbox>
                          </el-checkbox-group>
                        </el-form-item>
                      </div>
                    </div>
                    <div class="info_block">
                      <div class="top">
                        自定义配套信息
                        <el-switch
                          v-model="basicInfoForm.customFacilityStatus"
                            :active-value="1"
                            :inactive-value="0">
                        </el-switch>
                      </div>
                      <div class="bottom">
                        <div class="input_list" v-for="(item,index) in checkLists2" :key="index">
                          <div class="title">
                            <el-input v-model="item.title"
                            placeholder="类型标题，建议6字以内" clearable maxlength="64" :disabled="!basicInfoForm.customFacilityStatus"></el-input>
                          </div>
                          <div class="desc">
                            <el-input v-model="item.description"
                            placeholder="请输入配套内容，建议100字以内" clearable maxlength="225" :disabled="!basicInfoForm.customFacilityStatus"></el-input>
                          </div>
                          <div class="button" :class="{'disable':!basicInfoForm.customFacilityStatus}">
                            <i class="el-icon-circle-plus" @click="addInput(index)"></i>
                            <i class="el-icon-error" @click="delInput(index)" v-if="checkLists2.length !== 1"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </el-col>
                </el-col>
                <el-col :span="24">
                  <div class="title_info">物业规划</div>
                </el-col>
                <el-col :span="24">
                  <el-col :span="8">
                    <el-form-item label="物业公司："
                                  :label-width="formLabelWidth">
                      <el-input v-model="basicInfoForm.propertyCompanyName"
                                auto-complete="off"
                                clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="占地面积："
                                  :label-width="formLabelWidth"
                                  prop='floorSpace'>
                      <el-input v-model="basicInfoForm.floorSpace"
                                auto-complete="off"
                                clearable>
                        <template slot="append">㎡</template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="物业费："
                                  :label-width="formLabelWidth"
                                  prop='propertyFee'>
                      <el-input v-model="basicInfoForm.propertyFee"
                                auto-complete="off"
                                clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="总户数："
                                  :label-width="formLabelWidth"
                                  prop='numberRoom'>
                      <el-input v-model="basicInfoForm.numberRoom"
                                auto-complete="off"
                                clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="绿化率："
                                  :label-width="formLabelWidth"
                                  prop='greeningRate'>
                      <el-input v-model="basicInfoForm.greeningRate"
                                auto-complete="off"
                                clearable>
                        <template slot="append">%</template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="容积率："
                                  :label-width="formLabelWidth"
                                  prop='plotRate'>
                      <el-input v-model="basicInfoForm.plotRate"
                                auto-complete="off"
                                clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="停车数量："
                                  :label-width="formLabelWidth"
                                  prop='numberCarport'>
                      <el-input v-model="basicInfoForm.numberCarport"
                                auto-complete="off"
                                clearable></el-input>
                    </el-form-item>
                  </el-col>
                </el-col>
                <el-col :span="24">
                  <div class="title_info">项目展示</div>
                </el-col>
                <el-col :span="24">
                  <el-col :span="16">
                    <el-form-item label="全景资料："
                                  prop='vrUrl'
                                  :label-width="formLabelWidth">
                      <el-input v-model="basicInfoForm.vrUrl"
                                auto-complete="off"
                                clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="22"
                          class="doorSpecifications">
                    项目封面图：( 推荐尺寸680px*290px，支持jpg/png格式 )
                  </el-col>
                  <el-col :span="22"
                          class="uploadImg">
                          <patternUpload 
                           ref='projectFirstUpload'
                           :name="'projectFirst'"
                           :id="'projectFirst'"
                           :maxNum="1"
                           :urls="projectFirstUrls"
                           @oss-child-urls="projectFirstChange"
                           @oss-delete-img="projectFirstDelete">
                          </patternUpload>
                  </el-col>
                  <el-col :span="22"
                          style="margin-top: 20px;"
                          class="doorSpecifications">
                    项目图册：( 推荐尺寸750px*400px，支持jpg/gif/png格式 )
                  </el-col>
                  <el-col :span="22"
                          class="uploadImg">
                    <ossUpload :id="'projectPhoto'"
                               :urls="projectPhotoUrls"
                               @oss-child-urls="projectPhotoChange"
                               @oss-delete-img="projectPhotoDelete">
                    </ossUpload>
                  </el-col>
                  <el-col :span="22"
                          style="margin-top:10px"
                          class="doorSpecifications">
                    项目视频：( 推荐大小30MB以内，支持MP4/Ogg/WEBM格式 )
                  </el-col>
                  <el-col :span="22"
                          class="uploadImg">
                    <patternUploadVideo ref="patternUploadVideo"
                                        :name="'infoExtend'"
                                        :id="'infoExtendVideo'"
                                        :urls="infoExtendVideoUrls"
                                        @oss-child-urls="changeInfoExpand"
                                        @oss-delete-img="delInfoExpand">
                    </patternUploadVideo>
                  </el-col>
                  <el-col :span="22"
                          style="margin-top: 20px;"
                          class="doorSpecifications">
                    项目公众号二维码：( 推荐尺寸400px*400px，支持jpg/png格式 )
                  </el-col>
                  <el-col :span="22"
                          class="uploadImg">
                          <patternUpload 
                           ref='wxPidUpload'
                           :name="'wxPid'"
                           :id="'wxPid'"
                           :maxNum="1"
                           :urls="wxPidUrls"
                           @oss-child-urls="wxPidChange"
                           @oss-delete-img="wxPidDelete">
                          </patternUpload>
                  </el-col>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
          <div class="fix_footer">
            <el-button type="primary" size="medium" @click.native="preservation('basicInfoRuleForm')">保 存</el-button>
          </div>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="户型管理"
                   name="second"
                   :disabled="!this.$route.query.projectId">
        <el-row>
          <el-col :span="12"
                  class="left_search">
            <el-col :span="8">
              <el-input v-model="roomPatternName"
                        placeholder="户型名称"
                        @keyup.enter.native="searchRoomPattern"
                        @change='searchRoomPatternChange'
                        clearable>
              </el-input>
            </el-col>
            <el-col :span="4"
                    style='text-align: right;'>
              <el-button type="primary"
                         @click='searchRoomPattern'>搜索</el-button>
            </el-col>
          </el-col>
          <el-col :span="12"
                  class="right_button">
            <el-button type="primary"
                       @click="title = '新增户型';isPost = true;dialogFormVisible = true;ossUploadUrls = []">添加</el-button>
            <el-upload class="upload-demo"
                       ref="upload"
                       :data="importPatternData"
                       :show-file-list="false"
                       :multiple="true"
                       action="/iCloud-rest/projects/roomPattern/upload/import"
                       accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                       :before-upload='beforeAvatarUpload'
                       :on-success="handleSuccess">
              <el-button size="mini"
                         type="primary"
                         style="width: 80px;margin-left: 0;margin-top: 10px;">导入户型</el-button>
            </el-upload>
            <el-button type="primary"
                       @click='roomPatternTemplateExport'>模版下载</el-button>
            <el-button type="primary"
                       @click='roomPatternBatchDeleting'>批量删除</el-button>
            <el-popover ref="popover5"
                        placement="bottom"
                        width="82"
                        trigger="hover"
                        v-model="visible"
                        v-if='false'>
              <div style="text-align: right; margin: 0">
                <el-button class="popoverButton"
                           size="mini"
                           type="primary">一键清空</el-button>
              </div>
            </el-popover>
            <el-button v-if='false'
                       class="more"
                       type="primary"
                       v-popover:popover5>更多...</el-button>
          </el-col>
          <el-col :span="24">
            <el-table :data="tableData"
                      style="width: 100%"
                      height="449"
                      @select='selectRoomPattern'
                      @select-all='selectRoomPatternAll'>
              <el-table-column type="selection"
                               width="55">
              </el-table-column>
              <el-table-column label="户型编号"
                               align="center"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{ scope.row.patternNo }}</span>
                </template>
              </el-table-column>
              <el-table-column label="房型名称"
                               align="center"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{ scope.row.roomPatternName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="户型类型"
                               align="center"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{ scope.row.roomCount | roomCountFilter }}</span>
                </template>
              </el-table-column>
              <el-table-column label="户型名称"
                               align="center"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="建筑面积"
                               align="center"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{ scope.row.outterArea }}</span>
                </template>
              </el-table-column>
              <el-table-column label="是否开启" :render-header="renderHeader" align="center">
                <template slot-scope="scope">
                  <span>
                    <el-switch v-model="scope.row.isEnabled" :active-value="1" :inactive-value="0" @change="doSetRoomEnable(scope.row)"></el-switch>
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="操作"
                               align="center">
                <template slot-scope="scope">
                  <el-button size="mini"
                             type="text"
                             class="operation"
                             @click="handleEdit(scope.$index, scope.row)">编辑
                  </el-button>
                  <el-button size="mini"
                             type="text"
                             class="operation"
                             @click="handleDelete(scope.$index, scope.row)">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="block">
              <el-pagination @size-change="handleSizeChange"
                             @current-change="handleCurrentChange"
                             :current-page="currentPage"
                             :page-sizes="[10, 20, 30, 40]"
                             :page-size="pageSize"
                             layout="total, sizes, prev, pager, next, jumper"
                             :total="totalRecord">
              </el-pagination>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="图册管理"
                   name="photo">
        <el-col :span="22"
                class="photoAlbumTitle">
          样板间：( 推荐尺寸750px*400px，支持jpg/gif/png格式 )
        </el-col>
        <el-col :span="22"
                class="photoAlbum">
          <patternUpload :name="'Project'"
                         :id="'yangbanjian'"
                         :urls="yangbanjianPhotoUrls"
                         @oss-child-urls="yangbanjianPhotoChange"
                         @oss-delete-img="yangbanjianPhotoDelete">
          </patternUpload>
        </el-col>
        <el-col :span="22"
                class="photoAlbumTitle">
          效果图：( 推荐尺寸750px*400px，支持jpg/gif/png格式 )
        </el-col>
        <el-col :span="22"
                class="photoAlbum">
          <patternUpload :name="'Project'"
                         :id="'xiaoguotu'"
                         :urls="xiaoguotuPhotoUrls"
                         @oss-child-urls="xiaoguotuPhotoChange"
                         @oss-delete-img="xiaoguotuPhotoDelete">
          </patternUpload>
        </el-col>
        <el-col :span="22"
                class="photoAlbumTitle">
          配套图：( 推荐尺寸750px*400px，支持jpg/gif/png格式 )
        </el-col>
        <el-col :span="22"
                class="photoAlbum">
          <patternUpload :name="'Project'"
                         :id="'peitao'"
                         :urls="peitaoPhotoUrls"
                         @oss-child-urls="peitaoPhotoChange"
                         @oss-delete-img="peitaoPhotoDelete">
          </patternUpload>
        </el-col>
        <el-col :span="22"
                class="photoAlbumTitle">
          实景图：( 推荐尺寸750px*400px，支持jpg/gif/png格式 )
        </el-col>
        <el-col :span="22"
                class="photoAlbum">
          <patternUpload :name="'Project'"
                         :id="'shijing'"
                         :urls="shijingPhotoUrls"
                         @oss-child-urls="shijingPhotoChange"
                         @oss-delete-img="shijingPhotoDelete">
          </patternUpload>
        </el-col>
        <el-col :span="22"
                class="photoAlbumTitle">
          售楼处：( 推荐尺寸750px*400px，支持jpg/gif/png格式 )
        </el-col>
        <el-col :span="22"
                class="photoAlbum">
          <patternUpload :name="'Project'"
                         :id="'shoulouchu'"
                         :urls="shoulouchuPhotoUrls"
                         @oss-child-urls="shoulouchuPhotoChange"
                         @oss-delete-img="shoulouchuPhotoDelete">
          </patternUpload>
        </el-col>
        <el-col :span="16"
                :push='8'
                class="preservation">
          <el-button type="primary"
                     @click.native="savePhoto">保 存</el-button>
        </el-col>
      </el-tab-pane>
      <el-tab-pane label="项目分期"
                   name="four">
        <el-row style="line-height: 40px;margin-bottom: 16px;">
          <el-col :span="2">分期名称：</el-col>
          <el-col style='padding-right: 20px;'
                  :span="6">
            <el-input v-model="intentionStagesName" placeholder="请输入分期名称"></el-input>
          </el-col>
          <el-col :span="2">
            <el-button type="primary"
                           @click='getIntentionStagesList()'>搜索</el-button>
          </el-col>
          <el-col :span="14" style='text-align: right;'>
            <el-button type="primary"
                           @click='dialogIntentionStagesVisible=true'>添加分期</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-table ref="multipleTable"
                :data="intentionStagesList"
                style="width: 100%"
                highlight-current-row>
            <!-- <el-table-column type="index"
                             width="50">
            </el-table-column> -->
            <el-table-column prop="stageNo"
                             label="分期编号"
                             min-width="100">
              <template slot-scope="scope">
                  <span :title="scope.row.stageNo">{{ scope.row.stageNo}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="name"
                             label="分期名称"
                             min-width="160">
              <template slot-scope="scope">
                  <span :title="scope.row.name">{{ scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作"  width="280" align="center">
              <template slot-scope="scope">
                <el-button type="text" v-if="userType===0" @click="bindIntentionStages(scope.row)">{{scope.row.outerStageId ?'修改':'关联'}}ERP分期</el-button>
                <el-button type="text" v-if="userType===0" @click="unbindIntentionStages(scope.row)">解绑ERP分期</el-button>
                <el-button type="text" @click="editIntentionStages(scope.row)">编辑</el-button>
                <el-button type="text" v-if="userType===0" @click="delIntentionStages(scope.row.stageId)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-col :span="24">
            <div class="block">
              <el-pagination @size-change="handleSizeChange2"
                             @current-change="handleCurrentChange2"
                             :current-page="pageNum"
                             :page-sizes="[10, 50, 100, 200]"
                             :page-size="pageSize2"
                             layout="total, sizes, prev, pager, next, jumper"
                             :total="dataTotal">
              </el-pagination>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :title="title"
               :visible.sync="dialogFormVisible"
               top="20vh"
               @close="dialogClose('doorRuleForm')">
      <el-form :model="addDoorFrom"
               :rules="doorFormRules"
               ref="doorRuleForm">
        <el-row class="addDoorFrom">
          <el-col :span="24">
            <el-col :span="11">
              <el-form-item label="户型名称："
                            :label-width="formLabelWidth"
                            prop="name">
                <el-input v-model="addDoorFrom.name"
                          auto-complete="off"
                          placeholder="示例：A块地1号楼101"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="户型编号："
                            :label-width="formLabelWidth"
                            prop="patternNo">
                <el-input v-model="addDoorFrom.patternNo"
                          auto-complete="off"
                          placeholder="请输入户型编号"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="户型类型："
                            :label-width="formLabelWidth"
                            prop="roomCount">
                <el-select v-model="addDoorFrom.roomCount" placeholder="请选择户型类型" clearable>
                  <el-option v-for="item in roomCountList"
                             :key="item.type"
                             :label="item.value"
                             :value="item.type">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="房型名称："
                            :label-width="formLabelWidth"
                            prop="roomPatternName">
                <el-input v-model="addDoorFrom.roomPatternName"
                          auto-complete="off"
                          placeholder="示例：3室2厅2卫"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="建筑面积："
                            :label-width="formLabelWidth"
                            prop='outterArea'>
                <el-input v-model="addDoorFrom.outterArea"
                          auto-complete="off"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="套内面积："
                            :label-width="formLabelWidth"
                            prop='innerArea'>
                <el-input v-model="addDoorFrom.innerArea"
                          auto-complete="off"
                          clearable></el-input>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="22"
                  class="doorSpecifications">
            户型图：( 推荐尺寸640px*360px，支持jpg/gif/png格式 )
          </el-col>
          <el-col :span="22"
                  class="uploadImg">
            <patternUpload ref='patternUpload'
                           :name="'Pattern'"
                           v-if="isPost || isPut"
                           :id="'PatternImage'"
                           :urls="ossUploadUrls"
                           @oss-child-urls="fileChange"
                           @oss-delete-img="projectFileDelete">
            </patternUpload>
          </el-col>
          <el-col :span="22"
                  class="doorSpecifications1">
            样板间图：( 推荐尺寸640px*360px，支持jpg/gif/png格式 )
          </el-col>
          <el-col :span="22"
                  class="uploadImg">
            <patternUpload ref='patternUpload'
                           :name="'Pattern1'"
                           v-if="isPost || isPut"
                           :id="'PatternImage1'"
                           :urls="ossUploadUrls1"
                           @oss-child-urls="fileChange1"
                           @oss-delete-img="projectFileDelete1">
            </patternUpload>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button class="dialog_foot_button"
                   v-if="isPost"
                   type="primary"
                   @click="addRoomPatter('doorRuleForm')">确 定
        </el-button>
        <el-button class="dialog_foot_button"
                   v-if="isPut"
                   type="primary"
                   @click="putRoomPatter('doorRuleForm')">确 定
        </el-button>
        <el-button class="dialog_foot_button"
                   @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--添加/编辑分期-->
    <el-dialog title="编辑分期"
               :visible.sync="dialogIntentionStagesVisible"
               top="20vh"
               @close="dialogIntentionStagesClose()">
      <el-form :model="intentionStagesFrom"
               :rules="intentionStagesFromRules"
               ref="intentionStagesFrom">
        <el-row class="addDoorFrom">
          <el-col :span="24">
            <el-form-item label="分期编号："
                          :label-width="formLabelWidth"
                          prop="stageNo">
              <el-input v-model="intentionStagesFrom.stageNo"
                        auto-complete="off"
                        placeholder="示例：分期编号"
                        clearable></el-input>
            </el-form-item>
            <el-form-item label="分期名称："
                          :label-width="formLabelWidth"
                          prop="name">
              <el-input v-model="intentionStagesFrom.name"
                        auto-complete="off"
                        placeholder="示例：分期名称"
                        clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button class="dialog_foot_button"
                   type="primary"
                   @click="doSaveIntentionStages()">确 定
        </el-button>
        <el-button class="dialog_foot_button"
                   @click="dialogIntentionStagesVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--项目分期绑定erp-->
    <el-dialog title="绑定ERP" :visible.sync="dialogFormVisible2" top="20vh">
      <el-form :model="erpProjectForm" :rules="erpProjectFormRules" ref="erpRuleForm" >
        <el-row>
          <el-col :span="20">
            <el-form-item :label="'ERP 项目'" :label-width="formLabelWidth" prop="name">
              <el-autocomplete
                class="inline-input"
                v-model="erpProjectForm.name"
                :fetch-suggestions="querySearch"
                placeholder="请选择 ERP 项目"
                @clear="clearERPProject"
                :clearable="true"
                @select="handleSelect"
                >
                <template slot-scope="props">
                  <div>{{ props.item.ProjectName }}</div>
                </template>
              </el-autocomplete>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="dialog_foot_button" type="primary" @click="bindErpConfirm('erpRuleForm')">确 定</el-button>
        <el-button class="dialog_foot_button" @click="dialogFormVisible2 = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  requestProjectAlbumGet,
  requestProjectListPost,
  requestProjectListPut,
  requestProjectList,
  requestRoomPatternList,
  requestRoomPatternPost,
  requestRoomPatternPut,
  requestRoomPatternDelete,
  requestRoomPatternBatchDeleting,
  setRoomEnable,
  requestExcelProcess,
  requestRoomPatternImagesDelete,
  requestProjectAlbumDelete,
  requestArea,
  requestProjectAlbum,
  getPromoteSort,
  getIntentionStages,
  saveIntentionStages,
  updateIntentionStages,
  deleteIntentionStages,
  doERPIntentionStages,
  requestERPProjectsGet
} from '../../store/fetch/api'
import patternUpload from '../../components/patternUpload'
//上传视频
import patternUploadVideo from '../../components/patternUploadVideo'
import util from '../../common/js/util.js'
import ossUpload from '../../components/ossUpload'
import * as oss from '../../common/js/ossBaseUrl'
import { validateReferred, validateReferred1, lengthControl, validateTelephone, validateNumber, oneHundredLengthControl, validateNumberPlotRate, validateNumberCarport } from '../../common/js/formValidation'
export default {
  name: 'AddProject',
  data () {
    return {
      pcaa: {},
      areaCascader: false,
      ossUploadUrls: [],
      ossUploadUrls1: [],
      projectPhotoUrls: [],
      roomPatternImages: [],
      roomPatternImages1: [],
      yangbanjianPhotoUrls: [],
      xiaoguotuPhotoUrls: [],
      peitaoPhotoUrls: [],
      shijingPhotoUrls: [],
      shoulouchuPhotoUrls: [],
      patternImages: [],
      organizationList: '',
      title: '新增户型',
      dialogFormVisible: false,
      isPost: false,
      isPut: false,
      activeName: 'first',
      visible: false,
      totalRecord: 1,
      currentPage: 1,
      pageSize: 1,
      totalPage: 1,
      formLabelWidth: '120px',
      roomPatternName: '',
      city: '',
      basicInfoForm: {
        imageUrls: [],
        companyId: this.$route.query.companyId,
        deleteFlag: '0',
        status: 1,
        tenantId: this.$route.query.tenantId,
        createUserId: this.user.createUserId,
        lastModifyUserId: this.user.lastModifyUserId,
        name: '',
        referred: '',
        number: '',
        developers: '',
        telephone: '',
        floorSpace: '',
        numberCarport: '',
        address: '',
        city: '',
        projectType:0,
        decorateType:0,
        provinceCode: '',
        cityCode: '',
        areaCode: '',
        propertyRight: '',
        propertyFee: '',
        plotRate: '',
        greeningRate: '',
        surroundFacility: '',
        sellPoint: '',
        openTime: '',
        averagePrice: '',
        maxArea: '',
        minArea: '',
        numberRoom: '',
        recommendActivity: '',
        showroomAddress: '',
        propertyCompanyName: '',
        lastOpenTime: '',
        deliveryTime: '',
        vrUrl: '',
        promoteSort:null,
        promoteSortRadio:0,
        videoUrl: '',
        longitude: '',
        latitude: '',
        avgPrice: '',
        isLimit:1,
        wxPidUrls:'',//项目公众号二维码
        projectFirstUrls:'',//项目封面图
        systemFacilityStatus:1,//系统定义配套信息开关
        systemFacilityList: [1,2,3,4,5,6],
        customFacilityStatus:1,//自定义配套信息开关
        customFacilityList: [],
      },
      promoteSortTemp:null,
      promoteSortList:[],
      importPatternData: {
        tenantId: this.user.tenantId,
        userId: this.user.managerId,
        projectId: this.$route.query.projectId,
        companyId: this.$route.query.companyId
      },
      basicInfoFormRules: {
        referred: [{ required: true, validator: validateReferred, trigger: 'blur' }],
        name: [{ required: true, validator: validateReferred1, trigger: 'blur' }],
        developers: [{ validator: lengthControl, trigger: 'blur' }],
        city: [{ required: true, message: '请选择项目城市', trigger: 'change' }],
        companyId: [{ required: true, message: '请选择所属公司', trigger: 'change' }],
        telephone: [{ required: true, message: '请输入项目电话', trigger: 'blur' }],
        floorSpace: [{ validator: validateNumber }],
        numberCarport: [{ validator: oneHundredLengthControl }],
        propertyRight: [{ validator: oneHundredLengthControl }],
        propertyFee: [{ validator: oneHundredLengthControl }],
        plotRate: [{ validator: validateNumberPlotRate }],
        greeningRate: [{ validator: validateNumberCarport }],
        numberRoom: [{ validator: validateNumber }],
        averagePrice: [{ validator: oneHundredLengthControl }],
        maxArea: [{ validator: validateNumber }],
        minArea: [{ validator: validateNumber }],
        vrUrl: [
          { min: 1, max: 1000, message: '长度在 1 到 1000 个字符', trigger: 'blur' },
        ],
        avgPrice: [{ validator: validateNumber }]
      },
      addDoorFrom: {
        tenantId: this.$route.query.tenantId,
        projectId: this.$route.query.projectId,
        patternNo: '',
        name: '',
        roomCount:'',
        roomPatternName: '',
        innerArea: '',
        outterArea: '',
        roomPatternImages: []
      },
      photoFrom: {
        yangbanjianPhotoImages: [],
        xiaoguotuPhotoImages: [],
        peitaoPhotoImages: [],
        shijingPhotoImages: [],
        shoulouchuPhotoImages: []
      },
      doorFormRules: {
        name: [{ required: true, message: '请输入户型名称', trigger: 'blur' }],
        roomPatternName: [{ required: true, message: '请输入房型名称', trigger: 'blur' }],
        patternNo: [{ required: true, message: '请输入户型编号', trigger: 'blur' }],
        roomCount: [{ required: true, message: '请选择户型类型', trigger: 'blur' }],
        innerArea: [{ validator: validateNumber }],
        outterArea: [{ validator: validateNumber }]
      },
      tableData: [],
      companyName: '',
      organizationParams: {
        tenantId: this.$route.query.tenantId,
        companyId: this.$route.query.companyId
      },
      roomPatternParams: {
        currentPage: 1,
        pageSize: 10,
        tenantId: this.$route.query.tenantId,
        projectId: '',
        name: ''
      },
      roomPatternSelection: [],
      projectTypeList: [
        { type: 0, value: '综合' },
        { type: 1, value: '住宅' },
        { type: 2, value: '别墅' },
        { type: 3, value: '商铺' },
        { type: 4, value: '商住' },
        { type: 5, value: '写字楼' },
        { type: 6, value: '地下室' },
        { type: 7, value: '市政工程' },
        { type: 8, value: '车位' },
        { type: 9, value: '其他' }
      ],
      decorateTypeList: [
        { type: 0, value: '暂无' },
        { type: 1, value: '毛坯房' },
        { type: 2, value: '精装房' },
        { type: 3, value: '简装房' },
        { type: 4, value: '其他' }
      ],
      projectStatusList: [
        { type: 0, value: '暂无' },
        { type: 1, value: '待售' },
        { type: 2, value: '在售' },
        { type: 3, value: '售罄' }
      ],
      roomCountList: [
        { type: 1, value: '1居' },
        { type: 2, value: '2居' },
        { type: 3, value: '3居' },
        { type: 4, value: '4居' },
        { type: 5, value: '5居' },
        { type: 6, value: '5居以上' }
      ],
      infoExpand: {//信息扩展表单
        name: '',
        imgUrls: [],
      },
      infoExpandRules: {//表单验证规则
        name: [
          { required: true, message: '请输入全景资料名称', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' },
        ],
      },
      infoExtendVideoUrls: [],
      userType:1,//0系统管理员，1项目管理员

      intentionStagesName:'',//分期搜索名称
      intentionStagesList: [],//项目分期列表
      pageTotal: 1,   //总页数
      pageNum: 1,      //当前页数
      pageSize2: 10, //分页大小,每页多少条
      dataTotal: 0,   //数据总条数
      dialogIntentionStagesVisible:false,
      intentionStagesFrom: {
        stageId: '',
        stageNo:'',
        name: ''
      },
      intentionStagesFromRules: {
        stageNo: [{ required: true, message: '请输入分期编号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入分期名称', trigger: 'blur' }]
      },
      dialogFormVisible2: false,
      erpProjectForm: {
        tenantId: this.user.tenantId,
        name: '',
        outerProjectId: '',
        projectId: '',
        createUserId: this.user.createUserId,
        lastModifyUserId: this.user.lastModifyUserId
      },
      erpProjectFormRules: {
        name: [{ required: true, message: '请选择 ERP 项目!', trigger: 'change' }]
      },
      erpList:null,
      selectedStageId: '',
      dynamicTags: ['x'],//卖点标签
      inputTagsVisible: false,
      inputTagsValue: '',
      wxPidUrls:[],//项目公众号二维码
      projectFirstUrls:[],//项目封面图
      checkLists: [{
        value:1,
        label:'地铁'
      },{
        value:2,
        label:'公交'
      },{
        value:3,
        label:'医疗'
      },{
        value:4,
        label:'学校'
      },{
        value:5,
        label:'银行'
      },{
        value:6,
        label:'购物'
      }],
      checkLists2: [{
        title:'',
        description:''
      }],
    }
  },
  props: ['user'],
  components: {
    patternUpload,
    patternUploadVideo,
    ossUpload
  },
  filters:{
    roomCountFilter (value){
      switch (value) {
          case 1:
              return '1居';
          case 2:
              return '2居';
          case 3:
              return '3居';
          case 4:
              return '4居';
          case 5:
              return '5居';
          case 6:
              return '5居以上';
          default:
              return '--';
      }
    },
  },
  created () {
    this.getArea()
    this.getRoomPatternList()
    this.getCompany()
    if (this.$route.query.projectId) {
      this.getProject()
      this.getProjectAlbum()
    }
    let userInfo = JSON.parse(unescape(util.getCookie('tenantManger')))
    userInfo && (this.userType = userInfo.type)
  },
  methods: {
    fileChange (imgUrls) {
      let arr = []
      imgUrls.forEach((url, index) => {
        let obj = {
          createUserId: this.user.createUserId,
          lastModifyUserId: this.user.lastModifyUserId,
          status:1,
          imageSrc: url
        }
        this.roomPatternImages[index] = obj
      })
    },
    fileChange1 (imgUrls) {
      imgUrls.forEach((url, index) => {
        let obj = {
          createUserId: this.user.createUserId,
          lastModifyUserId: this.user.lastModifyUserId,
          status:2,
          imageSrc: url
        }
        this.roomPatternImages1[index] = obj
      })
    },
    publicPhotoEvent (imgUrls, type, that) {
      //之前阿里云上传接口是同步的，现在变成异步了，之前的处理逻辑有bug
      // let urlData = {
      //   projectId: this.$route.query.projectId,
      //   createUserId: this.user.createUserId,
      //   lastModifyUserId: this.user.lastModifyUserId,
      //   uri: imgUrls[imgUrls.length - 1],
      //   pictureType: type
      // }
      // that.push(urlData)
      that.splice(0,that.length)
      imgUrls.map(item=>{
        that.push({
          projectId: this.$route.query.projectId,
          createUserId: this.user.createUserId,
          lastModifyUserId: this.user.lastModifyUserId,
          uri: item,
          pictureType: type
        })
      })
    },
    async publicPhotoDelete (index, urls, that, ossUploadPath) {
      if (urls[index].albumId && urls[index].url) {
        const params = {
          albumId: urls[index].albumId,
          uri: urls[index].url
        }
        await requestProjectAlbumDelete(params)
      } else {
        that.splice(index, 1)
      }
      ossUploadPath.splice(index, 1)
    },
    yangbanjianPhotoChange (imgUrls) {
      this.publicPhotoEvent(imgUrls, 0, this.photoFrom.yangbanjianPhotoImages)
    },
    yangbanjianPhotoDelete (index, urls) {
      this.publicPhotoDelete(index, urls, this.photoFrom.yangbanjianPhotoImages, this.yangbanjianPhotoUrls)
    },
    xiaoguotuPhotoChange (imgUrls) {
      this.publicPhotoEvent(imgUrls, 1, this.photoFrom.xiaoguotuPhotoImages)
    },
    xiaoguotuPhotoDelete (index, urls) {
      this.publicPhotoDelete(index, urls, this.photoFrom.xiaoguotuPhotoImages, this.xiaoguotuPhotoUrls)
    },
    peitaoPhotoChange (imgUrls) {
      this.publicPhotoEvent(imgUrls, 2, this.photoFrom.peitaoPhotoImages)
    },
    peitaoPhotoDelete (index, urls) {
      this.publicPhotoDelete(index, urls, this.photoFrom.peitaoPhotoImages, this.peitaoPhotoUrls)
    },
    shijingPhotoChange (imgUrls) {
      this.publicPhotoEvent(imgUrls, 3, this.photoFrom.shijingPhotoImages)
    },
    shijingPhotoDelete (index, urls) {
      this.publicPhotoDelete(index, urls, this.photoFrom.shijingPhotoImages, this.shijingPhotoUrls)
    },
    shoulouchuPhotoChange (imgUrls) {
      this.publicPhotoEvent(imgUrls, 4, this.photoFrom.shoulouchuPhotoImages)
    },
    shoulouchuPhotoDelete (index, urls) {
      this.publicPhotoDelete(index, urls, this.photoFrom.shoulouchuPhotoImages, this.shoulouchuPhotoUrls)
    },
    changeInfoExpand (imgUrls) {
      // imgUrls.forEach((url, index) => {
      //   this.infoExpand.imgUrls[index] = url
      // })
      this.basicInfoForm.videoUrl = imgUrls[imgUrls.length - 1]
    },
    delInfoExpand (index) {
      // this.infoExtendVideoUrls.splice(index, 1)
      // this.infoExpand.imgUrls.splice(index, 1)
      this.infoExtendVideoUrls.splice(index, 1)
      this.basicInfoForm.videoUrl = ''
    },
    projectPhotoChange (imgUrls) {
      let arr = [...this.basicInfoForm.imageUrls, ...imgUrls]
      this.basicInfoForm.imageUrls = Array.from(new Set(arr))

      // imgUrls.forEach((url, index) => {
      //   this.basicInfoForm.imageUrls[index] = url
      // })
    },
    async getProjectAlbum () {
      const result = await requestProjectAlbumGet({ projectId: this.$route.query.projectId })
      result.data.forEach(imageUrl => {
        switch (imageUrl.pictureType) {
          case 0:
            this.yangbanjianPhotoUrls.push({ url: oss.OSS_BASE_URL + imageUrl.uri, albumId: imageUrl.albumId })
            this.photoFrom.yangbanjianPhotoImages.push(imageUrl)
            break
          case 1:
            this.xiaoguotuPhotoUrls.push({ url: oss.OSS_BASE_URL + imageUrl.uri, albumId: imageUrl.albumId })
            this.photoFrom.xiaoguotuPhotoImages.push(imageUrl)
            break
          case 2:
            this.peitaoPhotoUrls.push({ url: oss.OSS_BASE_URL + imageUrl.uri, albumId: imageUrl.albumId })
            this.photoFrom.peitaoPhotoImages.push(imageUrl)
            break
          case 3:
            this.shijingPhotoUrls.push({ url: oss.OSS_BASE_URL + imageUrl.uri, albumId: imageUrl.albumId })
            this.photoFrom.shijingPhotoImages.push(imageUrl)
            break
          case 4:
            this.shoulouchuPhotoUrls.push({ url: oss.OSS_BASE_URL + imageUrl.uri, albumId: imageUrl.albumId })
            this.photoFrom.shoulouchuPhotoImages.push(imageUrl)
            break
          case 5:
            this.shoulouchuPhotoUrls1.push({ url: oss.OSS_BASE_URL + imageUrl.uri, albumId: imageUrl.albumId })
            this.photoFrom.shoulouchuPhotoImages.push(imageUrl)
            break
        }
      })
    },
    async getArea () {
      const result = await requestArea()
      this.pcaa = JSON.parse(result.data)
      this.areaCascader = true
    },
    async projectFileDelete (index, urls) {
      if (urls[index].imageId && urls[index].url) {
        const params = {
          imageId: urls[index].imageId,
          uri: urls[index].url
        }
        await requestRoomPatternImagesDelete(params)
      }else{
        this.roomPatternImages.splice(urls.length - index - 1, 1)
      }
      this.ossUploadUrls.splice(index, 1)
    },
    async projectFileDelete1 (index, urls) {
      if (urls[index].imageId && urls[index].url) {
        const params = {
          imageId: urls[index].imageId,
          uri: urls[index].url
        }
        await requestRoomPatternImagesDelete(params)
      }else{
        this.roomPatternImages1.splice(urls.length - index - 1, 1)
      }
      this.ossUploadUrls1.splice(index, 1)
    },
    projectPhotoDelete (index) {
      this.projectPhotoUrls.splice(index, 1)
      this.basicInfoForm.imageUrls.splice(index, 1)
    },
    async roomPatternDelete (row) {
      let roomPatternId = { userId: this.user.managerId, roomPatternId: row.patternId }
      await requestRoomPatternDelete(roomPatternId)
      this.getRoomPatternList()
      this.$message.success('删除户型成功')
    },
    getCompany () {
      this.organizationList = JSON.parse(sessionStorage.getItem('company'))
      this.organizationList && this.organizationList.forEach((value) => {
        if (value.companyId.toString() === this.$route.query.companyId) {
          this.companyName = value.referred
        }
      })
    },
    async promoteSortRadioChange(value,type){
      // console.info(value)
      type && (this.promoteSortTemp = type)
      if(this.basicInfoForm.promoteSortRadio === 0){
        this.basicInfoForm.promoteSort = null
      }else{
        // console.info(type)
        let res = await getPromoteSort({
          tenantId: this.$route.query.tenantId,
          companyId: ''
        })
        if(res.status === 200 ){
          let arr = [1,2,3,4,5,6,7,8,9,10,11,12]
          let arrList = []
          arr.forEach(item=>{
            (res.data.indexOf(item)===-1) && arrList.push(item)
          })
          this.promoteSortTemp && arrList.push(this.promoteSortTemp)
          this.basicInfoForm.promoteSort = this.promoteSortTemp ? this.promoteSortTemp:this.promoteSortList[0]
          arrList.sort(function (a,b){ return a-b })
          this.promoteSortList = [...arrList]
        }
      }
    },
    async postProject () {
      if (Array.isArray(this.basicInfoForm.city)) {
        let citys = []
        let keys = []
        this.basicInfoForm.city.forEach(item => {
          for (let key in item) {
            citys.push(item[key])
            keys.push(key)
          }
        })
        this.basicInfoForm.city = citys.join('-')
        this.basicInfoForm.provinceCode = keys[0]
        this.basicInfoForm.cityCode = keys[1]
        this.basicInfoForm.areaCode = keys[2]
        this.basicInfoForm.sellPoint = this.dynamicTags.join()
        
        if (this.basicInfoForm.provinceCode === this.basicInfoForm.cityCode) {
          let keys = Object.keys(this.pcaa[this.basicInfoForm.cityCode])
          this.basicInfoForm.cityCode = keys[0]
        }
      }
      let arrList = []
      this.checkLists2.forEach(item=>{
        if(item.title || item.description){
          arrList.push(item)
        }
      })
      this.basicInfoForm.customFacilityList = [...arrList]

      delete this.basicInfoForm.projectId
      this.basicInfoForm.map = this.basicInfoForm.longitude + '|' + this.basicInfoForm.latitude
      let queryData = Object.assign({}, this.basicInfoForm)
      delete queryData.longitude
      delete queryData.latitude
      queryData.imageUrls = queryData.imageUrls.join(',')

      const result = await requestProjectListPost(queryData)
      this.$message.success('新增项目成功')
      this.$router.replace(
        {          path: '/home/addProject',
          query: {
            tenantId: this.$route.query.tenantId,
            companyId: this.$route.query.companyId,
            projectId: result.data.projectId
          }
        }
      )
    },
    async putProject () {
      // console.info(this.basicInfoForm)
      // debugger
      if (Array.isArray(this.basicInfoForm.city)) {
        let citys = []
        let keys = []
        this.basicInfoForm.city.forEach(item => {
          for (let key in item) {
            citys.push(item[key])
            keys.push(key)
          }
        })
        this.basicInfoForm.city = citys.join('-')
        this.basicInfoForm.provinceCode = keys[0]
        this.basicInfoForm.cityCode = keys[1]
        this.basicInfoForm.areaCode = keys[2]
        // this.basicInfoForm.sellPoint = this.dynamicTags.join()
        
        if (this.basicInfoForm.provinceCode === this.basicInfoForm.cityCode) {
          let keys = Object.keys(this.pcaa[this.basicInfoForm.cityCode])
          this.basicInfoForm.cityCode = keys[0]
        }
        // this.basicInfoForm.imageUrls = this.basicInfoForm.imageUrls.join(',')
      }
      let arrList = []
      this.checkLists2.forEach(item=>{
        if(item.title || item.description){
          arrList.push(item)
        }
      })
      this.basicInfoForm.customFacilityList = [...arrList]

      this.basicInfoForm.projectId = this.$route.query.projectId
      this.basicInfoForm.map = this.basicInfoForm.longitude + '|' + this.basicInfoForm.latitude
      let queryData = Object.assign({}, this.basicInfoForm)
      delete queryData.longitude
      delete queryData.latitude
      queryData.imageUrls = queryData.imageUrls.join(',')
      await requestProjectListPut(queryData)
      this.$message.success('修改项目成功')
    },
    async getProject () {
      let projectParams = {
        tenantId: this.$route.query.tenantId,
        companyId: this.$route.query.companyId,
        projectId: this.$route.query.projectId
      }
      let projectList = await requestProjectList(projectParams)
      let result = projectList.data.result[0]
      let city = result.city.split('-')
      result.city = city
      if (!result.imageUrls) {
        result.imageUrls = []
      } else {
        result.imageUrls = result.imageUrls.split(',')
        result.imageUrls.forEach(item => {
          if (item) {
            this.projectPhotoUrls.push(item)
          }
        })
      }
      this.basicInfoForm = Object.assign(this.basicInfoForm, result)
      // this.dynamicTags = this.basicInfoForm.sellPoint?[...this.basicInfoForm.sellPoint.split(',')] : []
      this.checkLists2 = this.basicInfoForm.customFacilityList.length ? [...this.basicInfoForm.customFacilityList]:[{
        title:'',
        description:''
      }]
      
      if(this.basicInfoForm.promoteSort!==null){
        this.basicInfoForm.promoteSortRadio=1
        this.promoteSortRadioChange(1, this.basicInfoForm.promoteSort)
      }

      let mapTemp = this.basicInfoForm.map && this.basicInfoForm.map.split('|')
      if (mapTemp.length > 1) {
        this.basicInfoForm.longitude = mapTemp[0]
        this.basicInfoForm.latitude = mapTemp[1]
      }
      result.videoUrl && this.infoExtendVideoUrls.push({
        url: oss.OSS_BASE_URL + result.videoUrl
      })
      result.wxPidUrls && this.wxPidUrls.push({
        url: oss.OSS_BASE_URL + result.wxPidUrls
      })
      result.projectFirstUrls && this.projectFirstUrls.push({
        url: oss.OSS_BASE_URL + result.projectFirstUrls
      })
    },
    async getRoomPatternList () {
      if (this.$route.query.projectId) {
        this.roomPatternParams.projectId = this.$route.query.projectId
      }
      let roomPatternList = await requestRoomPatternList(this.roomPatternParams)
      this.totalRecord = roomPatternList.data.totalRecord
      this.currentPage = roomPatternList.data.currentPage
      this.pageSize = roomPatternList.data.pageSize
      this.totalPage = roomPatternList.data.totalPage
      this.tableData = roomPatternList.data.result
    },
    addRoomPatter (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.addDoorFrom.projectId = this.$route.query.projectId
          this.addDoorFrom.roomPatternImages = [...this.roomPatternImages,...this.roomPatternImages1]
          await requestRoomPatternPost(this.addDoorFrom)
          this.getRoomPatternList()
          this.dialogFormVisible = false
          this.$message.success('新增户型成功')
        } else {
          return false
        }
      })
    },
    async putRoomPatter (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.addDoorFrom.projectId = this.$route.query.projectId
          this.addDoorFrom.roomPatternImages = [...this.roomPatternImages,...this.roomPatternImages1]
          await requestRoomPatternPut(this.addDoorFrom)
          this.getRoomPatternList()
          this.dialogFormVisible = false
          this.$message.success('修改户型成功')
        } else {
          return false
        }
      })
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
        this.timerId = setInterval(async () => {
          const result = await requestExcelProcess(params)
          const progress = { isShowProgress: true, percentage: result.data.process, info: result.data.message }
          this.$store.commit('UPDATE_PROGRESS', progress)
          if (result.data.status === 1) {
            clearInterval(this.timerId)
            this.getRoomPatternList()
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
    downloadByIframe (url) {
      var iframe = document.getElementById('myIframe')
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
    roomPatternTemplateExport () {
      this.downloadByIframe('./static/excelTemplate/户型导入模板.xlsx')
    },
    roomPatternBatchDeleting () {
      this.$confirm('此操作将永久删除所有选择户型, 是否继续?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        center: true
      }).then(async () => {
        const params = {
          userId: this.user.managerId,
          params: this.roomPatternSelection
        }
        await requestRoomPatternBatchDeleting(params)
        this.getRoomPatternList()
        this.$message.success('批量删除成功')
      }).catch(() => { })
    },
    //启用/禁用户型
    async doSetRoomEnable(obj={}){
      console.info(obj)
      let queryData = {
        patternId:obj.patternId,
        isEnabled:obj.isEnabled,
        userId:this.user.managerId
      }
      let res = await setRoomEnable(queryData)
      if(res.status == 200){
        this.$message.success((obj.isEnabled?'开启':'关闭')+'成功')
      }else{
        this.$message.error('开启失败')
      }
      this.getRoomPatternList()
    },
    selectRoomPattern (selection) {
      this.roomPatternSelection = []
      selection.forEach((select) => {
        this.roomPatternSelection.push(select.patternId)
      })
    },
    selectRoomPatternAll (selection) {
      this.roomPatternSelection = []
      selection.forEach((select) => {
        this.roomPatternSelection.push(select.patternId)
      })
    },
    searchRoomPattern () {
      this.roomPatternParams.name = this.roomPatternName
      this.getRoomPatternList()
    },
    searchRoomPatternChange () {
      if (!this.roomPatternName) {
        this.roomPatternParams.name = ''
        this.getRoomPatternList()
      }
    },
    preservation (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.$route.query.projectId) {
            this.putProject()
          } else {
            this.postProject()
          }
        } else {
          return false
        }
      })
    },
    async savePhoto () {
      let params = []
      for (let key in this.photoFrom) {
        this.photoFrom[key].forEach(item => {
          if (!item.albumId) {
            params.push(item)
          }
        })
      }
      const result = await requestProjectAlbum(params)
      for (let key in this.photoFrom) {
        this.photoFrom[key].forEach((item, index) => {
          if (!item.albumId) {
            result.data.map(i => {
              if (item.uri === i.uri) {
                this.photoFrom[key][index].albumId = i.albumId
                switch (i.pictureType) {
                  case 0:
                    this.yangbanjianPhotoUrls.map(item => {
                      if (item.url === oss.OSS_BASE_URL + i.uri) {
                        item.albumId = i.albumId
                      }
                    })
                    break
                  case 1:
                    this.xiaoguotuPhotoUrls.map(item => {
                      if (item.url === oss.OSS_BASE_URL + i.uri) {
                        item.albumId = i.albumId
                      }
                    })
                    break
                  case 2:
                    this.peitaoPhotoUrls.map(item => {
                      if (item.url === oss.OSS_BASE_URL + i.uri) {
                        item.albumId = i.albumId
                      }
                    })
                    break
                  case 3:
                    this.shijingPhotoUrls.map(item => {
                      if (item.url === oss.OSS_BASE_URL + i.uri) {
                        item.albumId = i.albumId
                      }
                    })
                    break
                  case 4:
                    this.shoulouchuPhotoUrls.map(item => {
                      if (item.url === oss.OSS_BASE_URL + i.uri) {
                        item.albumId = i.albumId
                      }
                    })
                    break
                }
              }
            })
          }
        })
      }
      this.$message.success('项目图册保存成功')
    },
    handleEdit (index, row) {
      this.title = '编辑户型'
      this.isPut = true
      this.dialogFormVisible = true
      this.addDoorFrom = Object.assign(row)
      
      this.patternImages = row.roomPatternImages
      row.roomPatternImages.forEach((imageUrl) => {
        if(imageUrl.status === 1){
          this.ossUploadUrls.push({ url: oss.OSS_BASE_URL + imageUrl.imageSrc, imageId: imageUrl.imageId })
        }else{
          this.ossUploadUrls1.push({ url: oss.OSS_BASE_URL + imageUrl.imageSrc, imageId: imageUrl.imageId })
        }
      })
    },
    handleDelete (index, row) {
      this.$confirm('此操作将永久删除该户型, 是否继续?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        center: true
      }).then(() => {
        this.roomPatternDelete(row)
      }).catch(() => { })
    },
    handleSizeChange (val) {
      this.roomPatternParams.pageSize = val
      this.getRoomPatternList()
    },
    handleCurrentChange (val) {
      this.roomPatternParams.currentPage = val
      this.getRoomPatternList()
    },
    beforeAvatarUpload (file) {
      this.importPatternData.projectId = this.$route.query.projectId
      let Xls = file.name.split('.')
      if (Xls[Xls.length - 1] === 'xls' || Xls[Xls.length - 1] === 'xlsx') {
        return file
      } else {
        this.$message.error('导入文件只能是 xls/xlsx 格式!')
        return false
      }
    },
    dialogClose (formName) {
      this.getRoomPatternList()
      this.isPost = false
      this.isPut = false
      this.$refs[formName].clearValidate()
      this.addDoorFrom = {
        tenantId: this.$route.query.tenantId,
        projectId: this.$route.query.projectId,
        patternNo: '',
        name: '',
        roomCount:'',
        roomPatternName: '',
        innerArea: '',
        outterArea: '',
        roomPatternImages: []
      }
      this.roomPatternImages = []
      this.roomPatternImages1 = []
      this.ossUploadUrls = []
      this.ossUploadUrls1 = []
    },
    //信息扩展表单提交
    saveInfoExpand () {
      let _that = this
      this.$refs.infoExpandForm.validate((valid) => {
        if (valid) {
          // console.log(_that.infoExpand)
          this.$message.success('信息扩展修改成功')
        } else {
          return false
        }
      })
    },
    //搜索项目分期列表
    async getIntentionStagesList(){
      let queryData = {
        param: {
          tenantId: this.$route.query.tenantId,
          projectId: this.$route.query.projectId,
          name: this.intentionStagesName
        },
        pageNum: this.pageNum,
        pageSize: this.pageSize2
      }
      let res = await getIntentionStages(queryData)
      if(res.status ===200){
        this.intentionStagesList = [...res.data.list]
        this.dataTotal = +res.data.total
        this.pageTotal = res.data.pages
        //当前页非第一页，且没有数据，重新加载第一页的数据
        res.data.list.length === 0 && this.pageNum !== 1 && (this.pageNum = 1) && (this.getIntentionStagesList())
      }
    },
    handleSizeChange2 (val) {
      console.log(`每页 ${val} 条`)
      this.pageSize2 = val
      this.getIntentionStagesList()
    },
    handleCurrentChange2 (val) {
      console.log(`当前页: ${val}`)
      this.pageNum = val
      this.getIntentionStagesList()
    },
    async bindIntentionStages(data={}){
      this.selectedStageId = data.stageId
      if (!this.$route.query.companyGuid) {
        this.$message.warning('请先选择绑定公司 ERP ！')
      } else {
        const params = {
          outerCompanyGUID: this.$route.query.companyGuid,
          tenantId: data.tenantId
        }
        const result = await requestERPProjectsGet(params)
        //兼容紫光项目，添加的逻辑
        if(result.data && result.data.length > 0 && result.data[0].hasOwnProperty('isFQ')){
          this.erpList = result.data.filter((item)=> {
            return item.isFQ === 1;
          });
        }else{
          this.erpList = result.data
        }
        // debugger
        if (data.outerStageId) {
          const idx = this.erpList.findIndex(item => item.ProjectID === data.outerStageId)
          if (idx > -1) {
            this.erpProjectForm.name = this.erpList[idx].ProjectName
            this.erpProjectForm.outerProjectId = this.erpList[idx].ProjectID
          }else{
            this.erpProjectForm.outerProjectId = data.outerStageId
            this.erpProjectForm.name = data.outerStageId
          }
        } else {
          this.erpProjectForm.name = ''
          this.erpProjectForm.outerProjectId = ''
        }
        this.erpProjectForm.projectId = data.projectId
        this.dialogFormVisible2 = true
      }

    },
    unbindIntentionStages(data={}){
      if (data.outerStageId) {
        this.$confirm('确认要解除绑定吗？', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning',
          center: true
        }).then(async () => {
          let queryData = {
            tenantId: this.$route.query.tenantId,
            projectId: this.$route.query.projectId,
            stageId:data.stageId,
            outerStageId:null//解绑为null
          }
          let res = await doERPIntentionStages(queryData)
          
          this.$message.success('解绑ERP成功')
          this.getIntentionStagesList()
        }).catch(e=>e)
      } else {
        this.$message.warning('暂未绑定ERP项目，无法解绑')
      }
    },
    editIntentionStages(row={}){
      this.dialogIntentionStagesVisible = true
      this.intentionStagesFrom = Object.assign({}, row)
    },
    delIntentionStages(id=''){
      this.$confirm('确认要删除吗？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        center: true
      }).then(async () => {
        let res = await deleteIntentionStages(id)
        this.$message({
          type: 'success',
          message: res.message.describeCn
        })
        this.getIntentionStagesList()
      })
    },
    dialogIntentionStagesClose () {
    },
    doSaveIntentionStages(){
      this.$refs.intentionStagesFrom.validate(async (valid) => {
        if (valid) {
          let queryData = {
            tenantId: this.$route.query.tenantId,
            projectId: this.$route.query.projectId,
            stageNo:this.intentionStagesFrom.stageNo,
            name:this.intentionStagesFrom.name
          }
          let res = null
          if(this.intentionStagesFrom.stageId){//编辑
            queryData.stageId = this.intentionStagesFrom.stageId
            res = await updateIntentionStages(queryData)
          }else{//新增
            res = await saveIntentionStages(queryData)
          }
          if(res.status === 200){
            this.dialogIntentionStagesVisible = false
            this.intentionStagesFrom = {
              stageId: '',
              stageNo:'',
              name: ''
            }
            //获取分期列表
            this.getIntentionStagesList()
          }else{
            this.$message({
              type: 'warning',
              message: res.message.describeCn
            })
          }
        } else {
          return false
        }
      })
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.ProjectName.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    querySearch (queryString, cb) {
      let restaurants = this.erpList
      let results = queryString ? restaurants.filter(this.createFilter(this.erpProjectForm.name)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    handleSelect (item) {
      this.erpProjectForm.name = item.ProjectName
      this.erpProjectForm.outerProjectId = item.ProjectID
    },
    clearERPProject () {
    },
    bindErpConfirm (formName) {
      this.$refs[formName].validate(async(valid) => {
        let param = JSON.parse(JSON.stringify(this.erpProjectForm))
        if (valid) {
          // debugger
          let queryData = {
            tenantId: this.$route.query.tenantId,
            projectId: this.$route.query.projectId,
            stageId:this.selectedStageId,
            outerStageId:param.outerProjectId//解绑为null
          }
          let res = await doERPIntentionStages(queryData)
          
          this.dialogFormVisible2 = false
          this.$message.success('绑定ERP成功')
          this.getIntentionStagesList()
        } else {
          return false
        }
      })
    },
    handleTagsClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    showTagsInput() {
      this.inputTagsVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      if(this.inputTagsValue.replace(/[^\x00-\xff]/g, '**').length > 1000){
        this.$message({
          type: 'warning',
          message: "请添加500个汉字以内的标签"
        })
      }else{
        let inputTagsValue = this.inputTagsValue;
        if (inputTagsValue) {
          this.dynamicTags.push(inputTagsValue);
        }
        this.inputTagsVisible = false;
        this.inputTagsValue = '';
      }
    },
    wxPidChange (imgUrls) {
      this.basicInfoForm.wxPidUrls = imgUrls[imgUrls.length - 1]
    },
    wxPidDelete (index, urls) {
        this.wxPidUrls.splice(index, 1)
        this.basicInfoForm.wxPidUrls = ''
    },
    projectFirstChange (imgUrls) {
      this.basicInfoForm.projectFirstUrls = imgUrls[imgUrls.length - 1]
    },
    projectFirstDelete (index, urls) {
        this.projectFirstUrls.splice(index, 1)
        this.basicInfoForm.projectFirstUrls = ''
    },
    //新增自定义配套信息
    addInput(index=0){
      if(this.basicInfoForm.customFacilityStatus){
        if(this.checkLists2.length<6){//最多可以自定义6个
          this.checkLists2.splice((index+1),0,{
            title:'',
            description:''
          })
        }else{
          this.$message({
            type: 'warning',
            message: "最多可添加6个自定义配套信息！"
          })
        }
      }
    },
    //删除自定义配套信息
    delInput(index=0){
      if(this.basicInfoForm.customFacilityStatus){
        // debugger
        this.checkLists2.splice(index,1)
      }
    },
    //根组件的页脚回调事件
    footerFunc(){
      this.preservation('basicInfoRuleForm')
    },
    //渲染户型table表头的方法-放提示功能
    renderHeader(h, { column, $index }) {
      return h(
        'el-tooltip',
        {
          props: {
            content: (function() {
              let label = column.label
              switch (label) {
                case '是否开启':
                  return '线上售楼是否展示该户型'
                  break
              }
            })(),
            placement: 'top'
          },
          domProps: {
            innerHTML: column.label + '<span class="el-icon-question"></span>'
          }
        },
        [h('span')]
      )
    },
  },
  watch: {
    'activeName': function (newVal, oldVal) {
      //初始化获取项目分期列表
      newVal ==='four' && this.getIntentionStagesList()
    },
  }
}
</script>
<style lang="scss">
.addProject {
  .area-select{
    height: 28px;
  }
}
</style>
<style scoped lang="scss">
.addProject {
  margin-top: 20px;
  .right_button {
    text-align: right;
    margin: 10px 0;
  }
  .left_search {
    margin: 10px 0;
  }
  .more {
    margin-left: 8px;
  }
  .block {
    text-align: right;
    margin: 20px 0;
  }
  .firstTitle {
    height: 42px;
    background: #f7f7f7;
    line-height: 42px;
    font-size: 12px;
    text-indent: 14px;
    border: 1px solid #eeeeee;
    display: flex;
    justify-content: space-between;
    .el-button{
      margin-right: 16px;
      height: 28px;
      margin-top: 6px;
    }
  }
  .basicInfoForm{
    padding-bottom: 20px;
  }
  .basicInfoForm,
  .infoExpandForm {
    .title_info{
      margin-top: 16px;
      text-indent:28px;
      height: 30px;
      line-height:30px;
      font-size: 18px;
      color: #333;
      font-weight: bold;
      margin-bottom: 12px;
      &:before{
        content:"";
        width: 6px;
        height: 15px;
        margin-right: 10px;
        display:inline-block;
        background-color: #0062FF;
      }
    }
    .sellPoint{
      .el-tag + .el-tag {
        margin-left: 10px;
        margin-bottom: 10px;
      }
      .button-new-tag {
        margin-left: 10px;
        height: 28px;
        line-height: 26px;
        padding-top: 0;
        padding-bottom: 0;
      }
      .input-new-tag {
        width: 90px;
        margin-bottom: 10px;
        margin-left: 10px;
        // vertical-align: bottom;
      }
    }
    .info_block{
      width: 90%;
      margin: 0 auto;
      padding: 20px 20px 1px;
      background-color: rgba(242, 242, 242, 1);
      & + .info_block{
        margin-top: 10px;
      }
      .top{
        position: relative;
        .el-switch{
          position: absolute;
          top:0px;
          right: 10px;
        }
      }
      .bottom{
        margin-top: 12px;
        .input_list{
          width: 100%;
          display: inline-block;
          line-height: 28px;
          margin-bottom: 12px;
          .title{
            width: 20%;
            float: left;
            margin-right: 12px;
          }
          .desc{
            width: 50%;
            float: left;
            margin-right: 12px;
          }
          .button{
            width: 20%;
            float: left;
            color: #0062FF;
            font-size: 20px;
            line-height: 32px;
            i{
              cursor: pointer;
              &.el-icon-error{
                color: #f56c6c
              }
              &:hover{
                
              }
            }
            &.disable{
              color: #ccc;
              i{
                &.el-icon-error{
                  color: #ccc
                }
              }
            }
          }
        }
      }
    }
  }
  .fix_footer{
    width: calc(100% - 280px);
    height: 60px;
    background-color: #fff;
    position: fixed;
    text-indent: 30%;
    bottom: 0px;
    z-index: 1999;
    .el-button{
      padding: 10px 60px;
      margin-top: 12px;
    }
  }
  .preservation {
    text-align: right;
    margin-bottom: 20px;
  }
  .operation {
    margin-left: 0 !important;
    margin-right: 10px;
  }
  .doorSpecifications,.doorSpecifications1 {
    padding-left: 38px;
  }
  .doorSpecifications1 {
    margin-top: 20px;
  }
  .photoAlbumTitle {
    padding-left: 10px;
  }
  .addDoorFrom {
    padding-left: 28px;
  }
  .uploadImg {
    margin-left: 38px;
    margin-top: 20px;
  }
  .photoAlbum {
    margin: 15px 0 10px 10px;
  }
  .upload-demo {
    display: inline-block;
    margin: 0 10px;
  }
  .el-upload {
    position: relative;
    .el-upload__input {
      display: block;
      opacity: 0;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 999;
      &:hover {
        cursor: pointer;
      }
    }
  }
  .el-date-editor {
    width: 100% !important;
  }
  .doubt{
    position: absolute;
    top: 7px;
    font-size: 16px;
    left: -20px;
    color: #ccc;
  }
  .el-autocomplete{
  width: 100%;
  }
}
</style>
