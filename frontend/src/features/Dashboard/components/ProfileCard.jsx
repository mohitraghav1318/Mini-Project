import Card from "@/components/Card/Card";
import DetailRow from "@/components/DetailRow/DetailRow";
import styles from "./ProfileCard.module.scss";

export default function ProfileCard({ user }) {
  const fields = [
    { label: "Name", value: user.name },
    { label: "Email", value: user.email },
    { label: "District", value: user.district },
    { label: "State", value: user.state },
    { label: "Work preference", value: user.workPreference },
    { label: "Points", value: user.points },
  ];

  return (
    <Card>
      <h1 className={styles.title}>Your profile</h1>
      <div className={styles.rows}>
        {fields.map((field) => (
          <DetailRow key={field.label} label={field.label} value={field.value} />
        ))}
      </div>
    </Card>
  );
}