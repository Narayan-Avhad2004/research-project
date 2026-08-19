import {
  CheckCircle2,
  Tag,
  ArrowLeftRight,
} from "lucide-react";

import "../styles/components/recommendation-badge.css";

const RecommendationBadge = ({
  type,
}) => {
  const recommendationTypes = {
    normal: {
      label: "Normal Sale",
      className:
        "recommendation-normal",
      icon: CheckCircle2,
    },

    discount: {
      label: "Discount Suggested",
      className:
        "recommendation-discount",
      icon: Tag,
    },

    transfer: {
      label: "Transfer Suggested",
      className:
        "recommendation-transfer",
      icon: ArrowLeftRight,
    },
  };

  const recommendation =
    recommendationTypes[type] ||
    recommendationTypes.normal;

  const Icon =
    recommendation.icon;

  return (
    <span
      className={`recommendation-badge ${recommendation.className}`}
    >
      <Icon size={13} />

      {recommendation.label}
    </span>
  );
};

export default RecommendationBadge;