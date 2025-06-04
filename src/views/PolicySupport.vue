<template>
	<div class="policy-support animate__animated animate__fadeIn">
		<el-container>
			<el-header>
				<nav-header />
			</el-header>
			<el-main>
				<el-row :gutter="20">
					<el-col :span="24">
						<h2 class="page-title animate__animated animate__fadeInDown">政策支持</h2>
					</el-col>
				</el-row>

				<!-- 政策分类标签 -->
				<el-row :gutter="20" class="mt-4">
					<el-col :span="24">
						<div class="policy-tags animate__animated animate__fadeIn">
							<el-tag
							  v-for="tag in policyTags"
							  :key="tag.value"
							  :type="tag.type"
							  :effect="activeTag === tag.value ? 'dark' : 'light'"
							  class="policy-tag animate__animated animate__fadeInUp"
							  :class="`animate__delay-${tag.value}s`"
							  @click="handleTagClick(tag.value)"
              >
								{{ tag.label }}
							</el-tag>
						</div>
					</el-col>
				</el-row>

				<!-- 政策列表 -->
				<el-row :gutter="20" class="mt-4">
					<el-col :span="24">
						<el-card
						  v-for="(policy, index) in filteredPolicies"
						  :key="policy.id"
						  class="policy-card animate__animated animate__fadeInLeft"
						  :class="`animate__delay-${index + 1}s`"
						  @click="handleViewDetail(policy)"
            >
							<template #header="">
								<div class="policy-header">
									<div class="policy-title">
										<h3>{{ policy.title }}</h3>
										<el-tag
										  :type="policy.status === '最新' ? 'success' : 'info'"
										  class="animate__animated animate__pulse animate__infinite"
										  v-if="policy.status === '最新'"
                    >
											{{ policy.status }}
										</el-tag>
									</div>
									<el-button
									  type="primary"
									  link=""
									  class="view-detail-btn animate__animated animate__fadeIn"
                  >
										查看详情
										<el-icon class="el-icon--right">
											<ArrowRight />
										</el-icon>
									</el-button>
								</div>
							</template>
							<div class="policy-content">
								<p class="policy-description">{{ policy.description }}</p>
								<div class="policy-meta">
									<span class="meta-item">
										<el-icon>
											<Calendar />
										</el-icon>
										发布时间：{{ policy.date }}
									</span>
									<span class="meta-item">
										<el-icon>
											<HomeFilled />
										</el-icon>
										发布单位：{{ policy.department }}
									</span>
									<span class="meta-item">
										<el-icon>
											<Document />
										</el-icon>
										政策类型：{{ policy.type }}
									</span>
								</div>
								<div class="policy-tags">
									<el-tag
									  v-for="tag in policy.tags"
									  :key="tag"
									  size="small"
									  effect="plain"
                  >
										{{ tag }}
									</el-tag>
								</div>
							</div>
						</el-card>
					</el-col>
				</el-row>

				<!-- 政策详情对话框 -->
				<el-dialog
				  v-model="dialogVisible"
				  :title="selectedPolicy?.title"
				  width="70%"
				  class="policy-dialog animate__animated animate__zoomIn"
        >
					<div class="policy-detail">
						<div class="detail-header">
							<div class="detail-meta">
								<span>
									<el-icon>
										<Calendar />
									</el-icon> 发布时间：{{ selectedPolicy?.date }}
								</span>
								<span>
									<el-icon>
										<HomeFilled />
									</el-icon> 发布单位：{{ selectedPolicy?.department }}
								</span>
								<span>
									<el-icon>
										<Document />
									</el-icon> 政策类型：{{ selectedPolicy?.type }}
								</span>
							</div>
							<el-tag :type="selectedPolicy?.status === '最新' ? 'success' : 'info'">
								{{ selectedPolicy?.status }}
							</el-tag>
						</div>
						<div class="detail-content">
							<h4>政策内容</h4>
							<p>{{ selectedPolicy?.content }}</p>
							<h4>实施范围</h4>
							<p>{{ selectedPolicy?.scope }}</p>
							<h4>申请条件</h4>
							<ul>
								<li v-for="(condition, index) in selectedPolicy?.conditions" :key="index">
									{{ condition }}
								</li>
							</ul>
							<h4>申请流程</h4>
							<el-steps :active="selectedPolicy?.process.length" finish-status="success">
								<el-step
								  v-for="(step, index) in selectedPolicy?.process"
								  :key="index"
								  :title="step.title"
								  :description="step.description"
                />
							</el-steps>
						</div>
						<div class="detail-footer">
							<el-button type="primary" @click="handleApply(selectedPolicy)">
								立即申请
							</el-button>
						</div>
					</div>
				</el-dialog>
			</el-main>
		</el-container>
	</div>
</template>

<script>
	import { ref, computed } from 'vue'
	import {
	Calendar,
	HomeFilled,
	Document,
	ArrowRight
	} from '@element-plus/icons-vue'
	import NavHeader from '../components/NavHeader.vue'
	import { ElMessage } from 'element-plus'
	import gsap from 'gsap'

	export default {
	name: 'PolicySupport',
	components: {
	NavHeader,
	Calendar,
	HomeFilled,
	Document,
	ArrowRight
	},
	setup() {
	const dialogVisible = ref(false)
	const selectedPolicy = ref(null)
	const activeTag = ref('all')

	const policyTags = [
	{ label: '全部', value: 'all', type: '' },
	{ label: '教育帮扶', value: 'education', type: 'success' },
	{ label: '心理健康', value: 'mental', type: 'warning' },
	{ label: '生活保障', value: 'life', type: 'info' },
	{ label: '就业支持', value: 'employment', type: 'danger' }
	]

	const policies = ref([
	{
	id: 1,
	title: '加强流动儿童关爱保护行动方案',
	status: '进行中',
	type: '综合政策',
	description: '国家层面首个面向流动儿童群体专门制定的关爱保护政策，提出完善保障措施和加强关爱服务，推进公共服务均等化，营造良好成长环境。',
	date: '2024-09-03',
	department: '民政部等21个部门联合发布',
	tags: ['流动儿童', '综合保护'],
	content: '该政策通过开展摸底排查、建立信息台账、制定服务清单等措施，明确服务对象与内容，推动地方政府落实流动儿童关爱服务。',
	scope: '全国范围',
	conditions: [
	'随父母或其他监护人离开户籍地',
	'跨县域异地居住或生活6个月以上',
	'不满十六周岁的未成年人'
	],
	process: [
	{ title: '摸底排查', description: '由地方民政部门牵头，联合相关部门开展排查' },
	{ title: '信息建档', description: '建立流动儿童信息台账' },
	{ title: '发布清单', description: '制定服务清单，明确服务内容和对象' }
	],
	link: 'https://www.gov.cn/zhengce/zhengceku/202409/content_6972120.htm'
	},
	{
	id: 2,
	title: '农村留守儿童和困境儿童关爱服务质量提升三年行动方案',
	status: '进行中',
	type: '教育政策',
	description: '聚焦教育保障，提出加强农村留守儿童和困境儿童教育服务质量，完善监护体系、加强心理健康教育、提升基层服务能力等。',
	date: '2024-07-26',
	department: '教育部、公安部、民政部等',
	tags: ['教育支持', '三年行动'],
	content: '该方案由教育部门牵头，联合多部门开展摸底排查，制定个性化帮扶措施，确保儿童接受义务教育，促进全面发展。',
	scope: '全国范围',
	conditions: [
	'农村留守儿童',
	'困境儿童'
	],
	process: [
	{ title: '排查建档', description: '由地方教育部门牵头，开展摸底排查并建立信息台账' },
	{ title: '个性化帮扶', description: '制定个性化措施，落实结对帮扶' },
	{ title: '教育保障', description: '确保适龄儿童接受义务教育' }
	],
	link: 'https://www.moe.gov.cn/jyb_xxgk/moe_1777/moe_1779/202407/t20240726_1142853.html'
	},
	{
	id: 3,
	title: '关于加强困境儿童心理健康关爱服务工作的指导意见',
	status: '进行中',
	type: '心理健康',
	description: '提出加强心理健康教育、建立转介机制、强化后续服务，将心理健康纳入困境儿童关爱服务核心内容，形成支持闭环。',
	date: '2023-10-26',
	department: '民政部、教育部、国家卫生健康委、共青团中央、全国妇联',
	tags: ['心理支持', '困境儿童'],
	content: '该指导意见通过教育、卫生健康等多部门合作，开展心理健康教育、测评与辅导，依托社区和学校建立支持体系，必要时转介专业机构。',
	scope: '全国范围',
	conditions: [
	'困境儿童',
	'包括留守儿童、流动儿童等'
	],
	process: [
	{ title: '心理教育', description: '依托社区和学校开展心理健康教育与咨询服务' },
	{ title: '测评辅导', description: '定期开展心理测评和心理辅导' },
	{ title: '专业转介', description: '必要时转介至专业医疗机构' }
	],
	link: 'https://www.gov.cn/zhengce/zhengceku/202311/content_6913516.htm'
	}
	])

	const filteredPolicies = computed(() => {
	if (activeTag.value === 'all') {
	return policies.value
	}
	return policies.value.filter(policy =>
	policy.tags.some(tag => tag.toLowerCase().includes(activeTag.value))
	)
	})

	const handleTagClick = (tag) => {
	activeTag.value = tag
	// 添加标签切换动画
	gsap.from('.policy-card', {
	y: 50,
	opacity: 0,
	duration: 0.5,
	stagger: 0.1
	})
	}

	const handleViewDetail = (policy) => {
	selectedPolicy.value = policy
	dialogVisible.value = true
	}

	const handleApply = (policy) => {
	window.open(policy.link, '_blank')
	}

	return {
	policies,
	policyTags,
	activeTag,
	filteredPolicies,
	dialogVisible,
	selectedPolicy,
	handleTagClick,
	handleViewDetail,
	handleApply
	}
	}
	}
</script>

<style scoped="">
	.policy-support {
	min-height: 100vh;
	background: #f5f7fa;
	}

	.page-title {
	font-size: 28px;
	color: #303133;
	margin-bottom: 24px;
	text-align: center;
	}

	.mt-4 {
	margin-top: 2rem;
	}

	.policy-tags {
	display: flex;
	gap: 1rem;
	margin-bottom: 2rem;
	flex-wrap: wrap;
	}

	.policy-tag {
	cursor: pointer;
	transition: all 0.3s ease;
	}

	.policy-tag:hover {
	transform: translateY(-2px);
	}

	.policy-card {
	margin-bottom: 1.5rem;
	cursor: pointer;
	transition: all 0.3s ease;
	}

	.policy-card:hover {
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(0,0,0,0.1);
	}

	.policy-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	}

	.policy-title {
	display: flex;
	align-items: center;
	gap: 1rem;
	}

	.policy-title h3 {
	margin: 0;
	font-size: 1.2rem;
	color: #303133;
	}

	.policy-content {
	padding: 1rem 0;
	}

	.policy-description {
	color: #606266;
	line-height: 1.6;
	margin-bottom: 1rem;
	}

	.policy-meta {
	display: flex;
	gap: 2rem;
	color: #909399;
	margin: 1rem 0;
	flex-wrap: wrap;
	}

	.meta-item {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	}

	.policy-tags {
	display: flex;
	gap: 0.5rem;
	margin-top: 1rem;
	}

	.view-detail-btn {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	}

	/* 政策详情对话框样式 */
	.policy-detail {
	padding: 1rem;
	}

	.detail-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 2rem;
	padding-bottom: 1rem;
	border-bottom: 1px solid #eee;
	}

	.detail-meta {
	display: flex;
	gap: 2rem;
	color: #606266;
	}

	.detail-content {
	margin: 2rem 0;
	}

	.detail-content h4 {
	color: #303133;
	margin: 1.5rem 0 1rem;
	}

	.detail-content p {
	color: #606266;
	line-height: 1.8;
	}

	.detail-content ul {
	padding-left: 1.5rem;
	color: #606266;
	line-height: 1.8;
	}

	.detail-footer {
	display: flex;
	justify-content: center;
	gap: 1rem;
	margin-top: 2rem;
	padding-top: 1rem;
	border-top: 1px solid #eee;
	}

	/* 响应式设计 */
	@media (max-width: 768px) {
	.policy-meta {
	flex-direction: column;
	gap: 1rem;
	}

	.detail-meta {
	flex-direction: column;
	gap: 1rem;
	}

	.policy-header {
	flex-direction: column;
	align-items: flex-start;
	gap: 1rem;
	}

	.view-detail-btn {
	align-self: flex-end;
	}
	}
</style>
