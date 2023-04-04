<script lang="ts">
	import Svelvet from 'svelvet';
	import type { UserNodeType, UserEdgeType } from 'svelvet';
	import type { Graph, Item } from '$lib/graph';

	export let graph: Graph;

	const shuffle = <T>(array: T[]): T[] => {
		let currentIndex = array.length;
		let temporaryValue: T;
		let randomIndex: number;

		while (currentIndex !== 0) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	};

	const nodes = (graph: Graph): UserNodeType[] => {
		const initialNode: UserNodeType = {
			id: graph.name,
			width: 100,
			height: 100,
			bgColor: 'blue',
			data: { label: graph.name },
			position: { x: 0, y: 0 },
			borderRadius: 50
		};

		const childPosition = (index: number, length: number) => {
			const angle = (index / length) * 2 * Math.PI;
			const x = Math.cos(angle) * 200;
			const y = Math.sin(angle) * 200;
			return { x, y };
		};

		const l2Regularization = (weights: number[], lambda: number): number[] => {
			const regularization = weights.map((weight) => lambda * weight * weight); // L2正則化項を計算
			const regularizedWeights = weights.map((weight, i) => weight - regularization[i]); // 正則化後の重みを計算
			return regularizedWeights;
		};

		const childLength = (weight: number, max: number) => {
			return (weight / max) * 200;
		};

		const random = shuffle(graph.concerned);

		const weights = l2Regularization(
			random.map((item: Item) => item.weight),
			0.5
		);

		const nodes = random.map((item: Item, i): UserNodeType => {
			console.log(weights[i]);
			return {
				id: item.name,
				width: childLength(weights[i], 1),
				height: childLength(weights[i], 1),
				bgColor: 'skyblue',
				data: { label: item.name },
				position: childPosition(i, graph.concerned.length),
				borderRadius: 50
			};
		});
		return [initialNode, ...nodes];
	};
	const edges = (graph: Graph): UserEdgeType[] => {
		return graph.concerned.map((item: Item): UserEdgeType => {
			return {
				id: `${graph.name}-${item.name}`,
				source: graph.name,
				target: item.name,
				type: 'bezier'
			};
		});
	};
</script>

<Svelvet
	resizable={true}
	nodes={nodes(graph)}
	edges={edges(graph)}
	width={1000}
	height={1000}
	bgColor={'white'}
	background
/>
