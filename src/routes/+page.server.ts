import { OPENAI_API_KEY } from '$env/static/private';
import { Configuration, OpenAIApi } from 'openai';
import type { Actions } from './$types';
import type { Graph, Item } from '$lib/graph';
import { mock } from '$lib/graph';

const openaiClient = new OpenAIApi(
	new Configuration({
		apiKey: OPENAI_API_KEY
	})
);

const chat = async (prompt: string) => {
	return openaiClient.createChatCompletion({
		model: 'gpt-3.5-turbo',
		messages: [
			{
				role: 'system',
				content: `{prompt}には歴史上の人物の名前が渡されます。その人物のソーシャルグラフを作成するのが目的です。
そのために下記をStep by Stepで実行してください。

[P1] {prompt}の人物と関連のある歴史上の人物を最大で20人列挙する
[P2] どのような関連があるのかをそれぞれの人物について、列挙する
[P3] [P2]をもとに関連する人物が{prompt}にとってどのくらい重要なのか、重み付けを与える(min: 0, max: 1)
[P4] [P3]の重要度が高い順にJSON形式で出力する(形式: [{"name": "...", "weight": ..., "detail": [...]}, ...])

[prompt]: ${prompt}`
			},
			{
				role: 'user',
				content: '[P4]以外の内容は出力しないでください。'
			}
		]
	});
};

function parseJSON(jsonString: string): Item[] {
	const regex = /{[\s\S]*?}/g;

	const matches = jsonString.matchAll(regex);
	const result: Item[] = [];
	for (const match of matches) {
		try {
			console.log(match.toString());
			const tmp = JSON.parse(match.toString());
			result.push(tmp);
		} catch (e) {
			continue;
		}
	}
	return result;
}

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name');
		if (!name) {
			return { success: false };
		}
		console.log({ name: name.toString() });

		try {
			// const response = await chat(name.toString());
			// const content = response.data.choices[0].message?.content || '';
			const content = mock[3];
			console.log({ content });

			const items = parseJSON(content);

			console.log({ items });

			return {
				success: true,
				name: name.toString(),
				output: { name: name.toString(), concerned: items } as Graph
			};
		} catch (e: unknown) {
			console.error(e);
			return {
				success: false,
				error: e
			};
		}
	}
} satisfies Actions;
