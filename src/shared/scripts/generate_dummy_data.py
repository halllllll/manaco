import csv
import random
from datetime import date, timedelta

def generate_dummy_data(num_entries_per_user=100): # エントリ数を100に増加
    headers = ["メールアドレス", "学習日", "点数", "かかった時間", "きもち", "取り組んだ内容", "メモ"]
    data = []

    # メールアドレスの形式を変更
    emails = [f"user_{chr(97 + i)}@example.com" for i in range(7)] # a-gに対応
    moods = ["normal", "happy", "tired", "happy"]
    
    # 取り組んだ内容のバリエーションを増加
    activity_types_pool = [
        "国語（現代文）", "国語（古文）", "国語（漢文）",
        "算数（計算ドリル）", "算数（図形問題）", "算数（文章題）",
        "理科（実験レポート）", "理科（生物の観察）", "理科（物理の法則）",
        "社会（歴史年号暗記）", "社会（地理の白地図）", "社会（公民の仕組み）",
        "英語（単語テスト）", "英語（リスニング）", "英語（スピーキング練習）",
        "プログラミング（Python基礎）", "プログラミング（Web開発）", "プログラミング（アルゴリズム）",
        "読書（小説）", "読書（専門書）", "読書（ビジネス書）",
        "運動（ジョギング）", "運動（筋トレ）", "運動（ヨガ）",
        "ピアノ練習", "ギター練習", "歌の練習",
        "絵を描く", "粘土細工", "DIY",
        "料理の手伝い", "部屋の片付け", "庭の手入れ",
        "ゲームの攻略研究", "YouTubeで学習動画視聴", "オンライン講座受講",
        "友達とオンラインで勉強会", "新しいアプリを試す", "ブログ記事執筆",
        "ニュース記事を読む", "ドキュメンタリー視聴", "瞑想"
    ]

    # メモのバリエーションを増加
    memo_pool = [
        "今日の学習は集中できた！", "少し難しかったけど、理解できた。", "新しい発見があった。",
        "眠かったけど頑張った。", "先生の説明が分かりやすかった。", "友達と一緒に勉強した。",
        "休憩中にゲームしすぎた。", "明日はもっと頑張るぞ！", "この分野は得意かも。",
        "復習が大事だと感じた。", "新しい参考書を試してみた。", "オンライン授業に参加。",
        "カフェで集中できた。", "ちょっとサボっちゃった。", "目標達成まであと少し！",
        "今日は特に捗った一日だった。", "苦手な部分を克服できた気がする。", "新しい知識が繋がった瞬間。",
        "もう少しで完成しそう。", "意外と時間がかかった。", "思ったより簡単だった。",
        "次のステップが楽しみ。", "集中力が途切れてしまった。", "気分転換が必要だ。",
        "この調子で頑張ろう。", "今日はここまで。", "明日も頑張るぞ！",
        "新しいツールを試してみた。", "エラー解決に時間がかかった。", "小さな進歩だけど嬉しい。",
        "計画通りに進んだ。", "少し計画が遅れている。", "もっと効率的にできないか考えよう。",
        "今日はよく頑張った！", "達成感がある。", "課題が見つかった。",
        "次の目標を設定しよう。", "気分転換に散歩した。", "音楽を聴きながら集中。",
        "静かな環境で集中できた。", "少し疲れたので早めに切り上げよう。", "新しいアイデアが浮かんだ。"
    ]

    start_date = date(2025, 4, 1)
    end_date = date(2025, 10, 31)
    delta = end_date - start_date

    for email in emails:
        for _ in range(num_entries_per_user):
            row = {}
            row["メールアドレス"] = email

            # 学習日
            random_days = random.randint(0, delta.days)
            row["学習日"] = (start_date + timedelta(days=random_days)).strftime("%Y-%m-%d")

            # 点数 (20%の確率で空欄)
            row["点数"] = random.randint(0, 100) if random.random() > 0.2 else ""

            # かかった時間 (秒) (20%の確率で空欄)
            row["かかった時間"] = random.randint(60, 3600) if random.random() > 0.2 else ""

            # きもち (20%の確率で空欄)
            row["きもち"] = random.choice(moods) if random.random() > 0.2 else ""

            # 取り組んだ内容 (20%の確率で空欄)
            if random.random() > 0.2:
                num_types = random.randint(1, 3)
                selected_types = random.sample(activity_types_pool, min(num_types, len(activity_types_pool)))
                row["取り組んだ内容"] = ", ".join(selected_types)
            else:
                row["取り組んだ内容"] = ""

            # メモ (20%の確率で空欄)
            row["メモ"] = random.choice(memo_pool) if random.random() > 0.2 else ""

            data.append(row)
    
    # データがメールアドレス順になるようにソート
    data.sort(key=lambda x: emails.index(x["メールアドレス"]))
    
    return headers, data

if __name__ == "__main__":
    headers, data = generate_dummy_data()
    output_file = "dummy_learning_activities.csv"
    with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=headers)
        writer.writeheader()
        writer.writerows(data)
    print(f"Dummy data generated and saved to {output_file}")
