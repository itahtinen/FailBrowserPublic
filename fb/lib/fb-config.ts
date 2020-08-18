// you should write db host here after deploy and doing "aws cloudfoundation describe-stacks"
export default {
  dbHost:
    "failbrowserstack-apidbcluster-3yeib7r7jigb.cluster-c21gcwumlkoy.eu-west-1.rds.amazonaws.com",
  dbUserName: "masteruser",
  dbPassword: "QwertY1234",
  ecrRepositoryBackend:
    " 364632538942.dkr.ecr.eu-west-1.amazonaws.com/failb-ecrba-qg1ohsstwf3i",
  ecrRepositoryFeeder:
    " 364632538942.dkr.ecr.eu-west-1.amazonaws.com/failb-ecrfe-11dumh2knspa9",
};
