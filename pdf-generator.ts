  const riskConfig = RISK_LEVEL_CONFIG[assessment.riskLevel];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>飞行员肾结石风险评估报告</Text>
          <Text style={styles.subtitle}>
            基于机器学习模型的个性化健康评估
          </Text>
          <Text style={styles.subtitle}>
            评估时间: {new Date().toLocaleString("zh-CN")}
          </Text>
        </View>